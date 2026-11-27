import { timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import tls from "node:tls";
import nodemailer from "nodemailer";
import MailComposer from "nodemailer/lib/mail-composer";

export type LifecycleMilestone =
  | "confirmed"
  | "dispatched"
  | "out_for_delivery"
  | "delivered"
  | "delayed_checkin";

export interface LifecycleOrderItem {
  name: string;
  quantity: number;
}

export interface LifecycleEmailInput {
  orderId: string;
  milestone: LifecycleMilestone;
  email: string;
  customerName?: string | null;
  orderDate?: string | null;
  paidTotalDisplay?: string | null;
  shippingAddressLines?: string[];
  items?: LifecycleOrderItem[];
  trackingNumber?: string | null;
  carrier?: string | null;
  latestCheckpoint?: string | null;
  destination?: string | null;
  estimatedDelivery?: string | null;
  dryRun?: boolean;
  forceResend?: boolean;
}

export interface LifecycleSendResult {
  ok: boolean;
  orderId: string;
  milestone: LifecycleMilestone;
  email: string;
  eventKey: string;
  sent: boolean;
  alreadySent: boolean;
  skippedReason?: string;
  rateLimited?: boolean;
  fallbackSuggested?: boolean;
  smtpResponse?: string;
  messageId?: string;
  subject?: string;
  error?: string;
}

const SPACEMAIL_HOST = "mail.spacemail.com";
const SPACEMAIL_SMTP_PORT = 465;
const SPACEMAIL_IMAP_PORT = 993;

export const MANUAL_PDF_FILENAME = "Buudy-Cleopatra-LED-Mask-User-Manual.pdf";
export const MANUAL_PDF_URL =
  "https://www.buudy.co.uk/Buudy-Cleopatra-LED-Mask-User-Manual.pdf";
export const VIDEO_GUIDE_URL =
  "https://www.buudy.co.uk/media/products/buudy-led-mask/videos/buudy-7-colour-led-mask-how-to-use-guide-uk.mp4";
export const EBOOK_URL = "https://www.buudy.co.uk/ebook";
export const APP_URL = "https://app.buudy.com/";
export const BASE_TRACK_URL = "https://www.buudy.co.uk/order-tracking";

export const EXCLUDED_ORDER_IDS = new Set<string>([
  "pay_QMPjdbz6Z4yGXG", // Cancelled / disputed cancellation
]);

const FIRST_NAME_OVERRIDES: Record<string, string> = {
  pay_E5JRd3xCn76O8n: "Neil",
  pay_hoFaBh4zicWMao: "Iain",
  pay_ebF8NHRudeNFd0: "Sarah",
};

const FULL_NAME_OVERRIDES: Record<string, string> = {
  pay_E5JRd3xCn76O8n: "Neil Webber",
  pay_hoFaBh4zicWMao: "Iain Barratt",
};

const BANNED_CONTENT_PATTERN =
  /\b(china|shenzhen|yunexpress|hypersku|aftership|90[- ]?day)\b/i;

let cachedPdfBuffer: Buffer | null = null;

function cleanEnv(value: string | undefined): string {
  return String(value || "").replace(/[\r\n]/g, "").trim();
}

export function getSpacemailCredentials(): { user: string; pass: string } | null {
  const user = cleanEnv(process.env.SPACEMAIL_USER) || "support@buudy.co.uk";
  const pass = cleanEnv(process.env.SPACEMAIL_PASSWORD);
  if (!user || !pass) return null;
  return { user, pass };
}

export function verifyBearerToken(
  headerValue: string | null,
  candidates: Array<string | undefined>,
): boolean {
  if (!headerValue || !headerValue.startsWith("Bearer ")) return false;
  const supplied = Buffer.from(headerValue.slice(7).trim(), "utf8");
  if (supplied.length === 0) return false;
  for (const rawSecret of candidates) {
    const cleanSecret = cleanEnv(rawSecret);
    if (!cleanSecret) continue;
    const expected = Buffer.from(cleanSecret, "utf8");
    if (
      supplied.length === expected.length &&
      timingSafeEqual(supplied, expected)
    ) {
      return true;
    }
  }
  return false;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizePublicText(value: string | null | undefined): string {
  if (!value) return "";
  return String(value)
    .replace(/\bYunExpress\b/gi, "Express Air Carrier")
    .replace(/\bHyperSKU\b/gi, "Fulfillment Hub")
    .replace(/\bAfterShip\b/gi, "Carrier Tracking")
    .replace(/\bShenzhen\b/gi, "International Origin Hub")
    .replace(/\bChina\b/gi, "International Origin")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeFirstName(
  orderId: string,
  rawName: string | null | undefined,
): string {
  if (FIRST_NAME_OVERRIDES[orderId]) return FIRST_NAME_OVERRIDES[orderId];
  let cleaned = String(rawName || "").trim();
  cleaned = cleaned.replace(/^(mr|mrs|ms|miss|dr|lady|sir|lord)\.?\s+/i, "").trim();
  if (!cleaned || /^(me|customer|null|undefined|guest|buyer)$/i.test(cleaned)) {
    return "there";
  }
  const first = cleaned.split(/\s+/)[0] || "";
  if (!first) return "there";
  if (first.length <= 2 && first === first.toUpperCase()) return first;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function normalizeFullName(
  orderId: string,
  rawName: string | null | undefined,
  firstName: string,
): string {
  if (FULL_NAME_OVERRIDES[orderId]) return FULL_NAME_OVERRIDES[orderId];
  const cleaned = String(rawName || "").trim();
  if (!cleaned || /^(me|customer|null|undefined|guest|buyer)$/i.test(cleaned)) {
    return firstName === "there" ? "Buudy Customer" : firstName;
  }
  return cleaned;
}

export function resolveCarrierDisplay(
  trackingNumber: string | null | undefined,
  rawCarrier?: string | null,
): string {
  const trk = String(trackingNumber || "").trim();
  const raw = sanitizePublicText(rawCarrier);
  if (!trk || /pending|assigned at packaging/i.test(trk)) {
    return "Assigned UK Tracked Courier";
  }
  if (/^H[0-9A-Z]{10,}$/i.test(trk) || /\bevri\b/i.test(raw)) {
    return "Evri Tracked";
  }
  if (/^[A-Z]{2}\d{9}GB$/i.test(trk) || /\broyal\s*mail\b/i.test(raw)) {
    return "Royal Mail Tracked 48";
  }
  if (/^YT\d+/i.test(trk)) {
    return "Priority Tracked Express";
  }
  return raw || "Priority Tracked Express";
}

function imapQuote(value: string): string {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

class ImapSession {
  private sock: tls.TLSSocket;
  private buffer = Buffer.alloc(0);
  private tagCounter = 0;

  private constructor(sock: tls.TLSSocket) {
    this.sock = sock;
    this.sock.on("data", (chunk: Buffer) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
    });
  }

  static connect(timeoutMs = 10_000): Promise<ImapSession> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        sock.destroy();
        reject(new Error("IMAP connection timed out"));
      }, timeoutMs);
      const sock = tls.connect({
        host: SPACEMAIL_HOST,
        port: SPACEMAIL_IMAP_PORT,
      });
      sock.once("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
      const session = new ImapSession(sock);
      session
        .waitForRegex(/^\* OK[^\r\n]*\r\n/m, timeoutMs)
        .then(() => {
          clearTimeout(timer);
          resolve(session);
        })
        .catch((err) => {
          clearTimeout(timer);
          sock.destroy();
          reject(err);
        });
    });
  }

  private waitForRegex(regex: RegExp, timeoutMs = 10_000): Promise<string> {
    return new Promise((resolve, reject) => {
      const started = Date.now();
      const check = () => {
        const str = this.buffer.toString("latin1");
        if (regex.test(str)) {
          this.buffer = Buffer.alloc(0);
          resolve(str);
          return true;
        }
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`IMAP wait timed out (${regex})`));
          return true;
        }
        return false;
      };
      if (check()) return;
      const onData = () => {
        if (check()) {
          this.sock.off("data", onData);
          this.sock.off("error", onErr);
        }
      };
      const onErr = (err: Error) => {
        this.sock.off("data", onData);
        reject(err);
      };
      this.sock.on("data", onData);
      this.sock.once("error", onErr);
    });
  }

  async command(cmd: string, timeoutMs = 10_000): Promise<string> {
    const tag = `B${++this.tagCounter}`;
    this.buffer = Buffer.alloc(0);
    this.sock.write(`${tag} ${cmd}\r\n`);
    const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const response = await this.waitForRegex(
      new RegExp(`^${escapedTag} (OK|NO|BAD)[^\\r\\n]*\\r\\n`, "m"),
      timeoutMs,
    );
    const taggedMatch = response.match(
      new RegExp(`^${escapedTag} (OK|NO|BAD)([^\\r\\n]*)`, "m"),
    );
    if (taggedMatch && taggedMatch[1] !== "OK") {
      throw new Error(`IMAP command failed (${cmd}): ${taggedMatch[1]}${taggedMatch[2]}`);
    }
    return response;
  }

  async appendSent(rawMime: Buffer, timeoutMs = 15_000): Promise<string> {
    const tag = `B${++this.tagCounter}`;
    this.buffer = Buffer.alloc(0);
    this.sock.write(`${tag} APPEND "Sent" (\\Seen) {${rawMime.length}}\r\n`);
    await this.waitForRegex(/^\+[^\r\n]*\r\n/m, timeoutMs);
    this.buffer = Buffer.alloc(0);
    this.sock.write(rawMime);
    this.sock.write("\r\n");
    const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const response = await this.waitForRegex(
      new RegExp(`^${escapedTag} (OK|NO|BAD)[^\\r\\n]*\\r\\n`, "m"),
      timeoutMs,
    );
    if (!new RegExp(`^${escapedTag} OK`, "m").test(response)) {
      throw new Error(`IMAP APPEND failed: ${response.trim()}`);
    }
    return response.trim();
  }

  async close(): Promise<void> {
    try {
      await this.command("LOGOUT", 3000);
    } catch {
      // Ignore logout socket close errors
    } finally {
      this.sock.destroy();
    }
  }
}

export async function fetchSentBuudyEvents(): Promise<Set<string>> {
  const creds = getSpacemailCredentials();
  if (!creds) return new Set();
  const session = await ImapSession.connect(10_000);
  try {
    await session.command(`LOGIN ${imapQuote(creds.user)} ${imapQuote(creds.pass)}`);
    await session.command('SELECT "Sent"');
    const fetchRaw = await session.command(
      "UID FETCH 1:* (BODY.PEEK[HEADER.FIELDS (X-BUUDY-EVENT)])",
      15_000,
    );
    const events = new Set<string>();
    const matches = fetchRaw.matchAll(/X-Buudy-Event:\s*([^\r\n]+)/gi);
    for (const m of matches) {
      const val = m[1]?.trim();
      if (val) events.add(val);
    }
    return events;
  } finally {
    await session.close();
  }
}

async function hasSentEventInImap(
  orderId: string,
  milestone: LifecycleMilestone,
): Promise<boolean> {
  const creds = getSpacemailCredentials();
  if (!creds) return false;
  const session = await ImapSession.connect(8_000);
  try {
    await session.command(`LOGIN ${imapQuote(creds.user)} ${imapQuote(creds.pass)}`);
    await session.command('SELECT "Sent"');
    const checkHeader = async (needle: string): Promise<boolean> => {
      const res = await session.command(
        `UID SEARCH HEADER X-Buudy-Event ${imapQuote(needle)}`,
      );
      const searchLine = res
        .split(/\r?\n/)
        .find((line) => line.startsWith("* SEARCH"));
      if (!searchLine) return false;
      const uids = searchLine
        .replace("* SEARCH", "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      return uids.length > 0;
    };

    if (await checkHeader(`${orderId}:${milestone}`)) return true;
    if (milestone === "confirmed") {
      if (await checkHeader(`${orderId}:catchup_`)) return true;
    }
    if (milestone === "delayed_checkin") {
      if (
        (await checkHeader(`${orderId}:catchup_`)) ||
        (await checkHeader(`${orderId}:dispatched`)) ||
        (await checkHeader(`${orderId}:delivered`))
      ) {
        return true;
      }
    }
    return false;
  } finally {
    await session.close();
  }
}

async function loadManualPdfBuffer(): Promise<Buffer> {
  if (cachedPdfBuffer) return cachedPdfBuffer;
  try {
    const buf = await readFile(
      /*turbopackIgnore: true*/ path.join(
        /*turbopackIgnore: true*/ process.cwd(),
        "public",
        MANUAL_PDF_FILENAME,
      ),
    );
    if (buf.byteLength > 10_000) {
      cachedPdfBuffer = buf;
      return buf;
    }
  } catch {
    // Fall through to remote fetch fallback
  }
  const response = await fetch(MANUAL_PDF_URL, {
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Unable to load PDF manual (${response.status})`);
  }
  const buf = Buffer.from(await response.arrayBuffer());
  cachedPdfBuffer = buf;
  return buf;
}

function buildCleopatraAndManualHtml(): string {
  return `
    <div style="background:#FFFFFF;border:1px solid #EADDCE;border-radius:14px;padding:18px 20px;margin:18px 0;">
      <p style="margin:0 0 8px 0;font-size:12px;font-weight:800;color:#A87030;text-transform:uppercase;letter-spacing:0.6px;">Your Buudy Cleopatra&trade; Edition &amp; Eco-Friendly Digital Guides</p>
      <p style="margin:0 0 10px 0;font-size:13.5px;color:#4A354B;">Your mask is the official <strong>Buudy 7 Colour LED Mask &mdash; Cleopatra&trade; Edition</strong>, produced and optically calibrated by Cleopatra&trade; Phototherapy Labs. Because of this calibration lineage, you will see <strong>&ldquo;Cleopatra&rdquo;</strong> printed on the mask itself when unboxing &mdash; with Buudy Skincare UK remaining your direct warranty and support team.</p>
      <p style="margin:0 0 12px 0;font-size:13.5px;color:#4A354B;">To eliminate unnecessary paper waste, <strong>no paper booklet is included inside the box</strong>. Instead, your full PDF User Manual is attached directly to this email alongside your step-by-step setup video and digital guides:</p>
      <div style="margin:12px 0;">
        <a href="${VIDEO_GUIDE_URL}" style="display:inline-block;margin:0 8px 8px 0;background:#2E102F;color:#FAF5EE;text-decoration:none;padding:10px 18px;border-radius:999px;font-size:12.5px;font-weight:700;">&#9654; Watch How-To-Use Video</a>
        <a href="${MANUAL_PDF_URL}" style="display:inline-block;margin:0 8px 8px 0;background:#FFFFFF;color:#2E102F;border:1px solid #2E102F;text-decoration:none;padding:10px 18px;border-radius:999px;font-size:12.5px;font-weight:700;">Digital Manual (PDF)</a>
        <a href="${EBOOK_URL}" style="display:inline-block;margin:0 8px 8px 0;background:#FFFFFF;color:#2E102F;border:1px solid #C9B29B;text-decoration:none;padding:10px 16px;border-radius:999px;font-size:12.5px;font-weight:700;">Skincare E-Book</a>
        <a href="${APP_URL}" style="display:inline-block;margin:0 0 8px 0;background:#FFFFFF;color:#2E102F;border:1px solid #C9B29B;text-decoration:none;padding:10px 16px;border-radius:999px;font-size:12.5px;font-weight:700;">Glow Coach App</a>
      </div>
      <p style="margin:8px 0 0 0;font-size:12.5px;color:#6E5A6F;"><strong>First-session reminder:</strong> Charge via USB-C, then <strong>unplug the cable completely first</strong> (the safety lockout keeps the LEDs off while plugged in) &rarr; flip the physical <strong>ON/OFF switch</strong> along the top inner edge &rarr; gently tap the centre forehead with a <strong>flat palm</strong>.</p>
    </div>
  `;
}

export function buildLifecycleEmailContent(input: LifecycleEmailInput) {
  const firstName = normalizeFirstName(input.orderId, input.customerName);
  const fullName = normalizeFullName(
    input.orderId,
    input.customerName,
    firstName,
  );
  const tracking =
    input.trackingNumber &&
    !/pending|assigned at packaging/i.test(input.trackingNumber)
      ? input.trackingNumber.trim()
      : "";
  const carrier = resolveCarrierDisplay(tracking, input.carrier);
  const checkpoint =
    sanitizePublicText(input.latestCheckpoint) ||
    (input.milestone === "confirmed"
      ? "Order Verified & Entering Optical Calibration"
      : input.milestone === "delivered"
        ? "Delivered Safely"
        : "Moving Through Tracked Network");
  const destination =
    sanitizePublicText(
      input.destination ||
        (input.shippingAddressLines || []).filter(Boolean).join(", "),
    ) || "United Kingdom";
  const trackUrl = tracking
    ? `${BASE_TRACK_URL}?tracking=${encodeURIComponent(tracking)}`
    : `${BASE_TRACK_URL}?order=${encodeURIComponent(input.orderId)}`;
  const items =
    input.items && input.items.length > 0
      ? input.items
      : [
          {
            name: "Buudy 7 Colour LED Mask — Cleopatra Edition + Red Torch Bundle",
            quantity: 1,
          },
        ];

  let subject = "";
  let badge = "";
  let headline = "";
  let introHtml = "";
  let introText = "";
  let nextStepHtml = "";
  let nextStepText = "";

  switch (input.milestone) {
    case "confirmed": {
      subject = `Order Confirmed & Digital Setup Pack: Your Buudy Cleopatra LED Mask (${input.orderId})`;
      badge = "Order Confirmed";
      headline = "Your order is confirmed & queued for optical calibration";
      introHtml = `
        <p style="margin:0 0 14px 0;font-size:15px;color:#4A354B;">Thank you for choosing Buudy Skincare UK! We&rsquo;ve confirmed your order (<strong>${escapeHtml(input.orderId)}</strong>) and queued your <strong>Buudy Cleopatra&trade; Edition LED Mask</strong> for pre-dispatch optical calibration.</p>
        <p style="margin:0 0 14px 0;font-size:15px;color:#2E102F;">While our calibration team completes protective inspection and packs your bundle, we&rsquo;ve attached your PDF User Manual and included your how-to-use video below so you&rsquo;re ready for your very first glow session.</p>
      `;
      introText = `Thank you for ordering from Buudy Skincare UK! Your order (${input.orderId}) is confirmed and entering Cleopatra Phototherapy Labs optical calibration ahead of dispatch.`;
      nextStepHtml = `<p style="margin:0 0 12px 0;font-size:13.5px;color:#4A354B;"><strong>What happens next:</strong> As soon as optical QA is completed and your parcel leaves our fulfillment hub, we&rsquo;ll email your live tracking reference automatically. You can also check live progress anytime via the button above.</p>`;
      nextStepText =
        "What happens next: We will automatically email your tracked courier reference once calibration completes and your parcel dispatches.";
      break;
    }
    case "dispatched": {
      subject = `Dispatched: Your Buudy Cleopatra LED Mask is on the way${tracking ? ` (${tracking})` : ""}`;
      badge = "Dispatched";
      headline = `Your parcel is dispatched with ${escapeHtml(carrier)}`;
      introHtml = `
        <p style="margin:0 0 14px 0;font-size:15px;color:#4A354B;">Great news &mdash; your <strong>Buudy Cleopatra&trade; Edition LED Mask</strong> (<strong>${escapeHtml(input.orderId)}</strong>) has completed optical calibration and has been assigned to <strong>${escapeHtml(carrier)}</strong> for delivery to your address.</p>
      `;
      introText = `Great news — your Buudy Cleopatra Edition LED Mask (${input.orderId}) has completed calibration and been dispatched with ${carrier}.`;
      nextStepHtml = `<p style="margin:0 0 12px 0;font-size:13.5px;color:#4A354B;"><strong>Tracking note:</strong> If the first scan reads &ldquo;Shipment information received&rdquo;, your label is registered on the express manifest and initial depot scans appear automatically once processed at the hub.</p>`;
      nextStepText =
        "Tracking note: Live scans refresh automatically on your tracking page as your parcel progresses to UK doorstep delivery.";
      break;
    }
    case "out_for_delivery": {
      subject = `Out for Delivery Today: Your Buudy Cleopatra LED Mask${tracking ? ` (${tracking})` : ""}`;
      badge = "Out For Delivery";
      headline = `Your parcel is out for delivery today with ${escapeHtml(carrier)}`;
      introHtml = `
        <p style="margin:0 0 14px 0;font-size:15px;color:#4A354B;">Exciting news &mdash; your <strong>Buudy Cleopatra&trade; Edition LED Mask</strong> (<strong>${escapeHtml(input.orderId)}</strong>) is now out with your local <strong>${escapeHtml(carrier)}</strong> courier for delivery today!</p>
        <p style="margin:0 0 14px 0;font-size:15px;color:#2E102F;">We&rsquo;ve included your Eco-Friendly Digital User Manual (attached PDF) and 60-second setup video below so you can unbox and start safely right away.</p>
      `;
      introText = `Exciting news — your Buudy Cleopatra Edition LED Mask (${input.orderId}) is out for delivery today with ${carrier}! Your digital manual PDF is attached for unboxing.`;
      nextStepHtml = `<p style="margin:0 0 12px 0;font-size:13.5px;color:#4A354B;"><strong>Doorstep tip:</strong> Check your tracking link for live safeplace/courier updates from ${escapeHtml(carrier)}.</p>`;
      nextStepText = `Doorstep tip: Check your tracking link for live delivery window updates from ${carrier}.`;
      break;
    }
    case "delivered": {
      subject = `Delivered: Welcome to your Buudy Cleopatra LED Mask & Digital Setup Pack (${input.orderId})`;
      badge = "Delivered";
      headline = "Your Buudy Cleopatra™ Edition has arrived — start here";
      introHtml = `
        <p style="margin:0 0 14px 0;font-size:15px;color:#4A354B;">Your courier confirms that your <strong>Buudy Cleopatra&trade; Edition LED Mask</strong> (<strong>${escapeHtml(input.orderId)}</strong>) has now been delivered!</p>
        <p style="margin:0 0 14px 0;font-size:15px;color:#2E102F;">Before your first session, please take 60 seconds to read the quick-start steps and watch the setup video below &mdash; <strong>remember to unplug the USB-C charging cable completely before switching the mask on</strong>.</p>
      `;
      introText = `Your Buudy Cleopatra Edition LED Mask (${input.orderId}) has been delivered! Remember: charge via USB-C, UNPLUG the cable completely before turning on, flip the top switch, and tap the centre forehead with a flat palm.`;
      nextStepHtml = `<p style="margin:0 0 12px 0;font-size:13.5px;color:#4A354B;"><strong>Need a hand?</strong> Just reply directly to this email anytime &mdash; our UK Skincare Support team is always happy to help.</p>`;
      nextStepText =
        "Need a hand? Simply reply directly to this email anytime for personal UK support.";
      break;
    }
    case "delayed_checkin": {
      subject = `Order Status Check-In & Digital Setup Pack: Buudy Cleopatra LED Mask (${input.orderId})`;
      badge = "Order Check-In";
      headline = "An honest status check on your Buudy Cleopatra™ Edition";
      introHtml = `
        <p style="margin:0 0 14px 0;font-size:15px;color:#4A354B;">We wanted to check in on your order (<strong>${escapeHtml(input.orderId)}</strong>) while peak Black Friday demand moves through our optical calibration and courier queues.</p>
        <p style="margin:0 0 14px 0;font-size:15px;color:#2E102F;">Your bundle is active in our dispatch pipeline, and we&rsquo;ve attached your PDF User Manual and linked your setup video below ahead of arrival so you have everything ready in one place.</p>
      `;
      introText = `We wanted to send a quick check-in on order ${input.orderId}. Your Buudy Cleopatra Edition LED Mask is active in our dispatch queue and your digital setup pack is attached below.`;
      nextStepHtml = `<p style="margin:0 0 12px 0;font-size:13.5px;color:#4A354B;"><strong>Always transparent:</strong> Click &ldquo;Track Your Order Live&rdquo; above anytime for real-time courier updates, or simply reply directly to this email and our UK team will personally follow up on your parcel.</p>`;
      nextStepText =
        "Always transparent: Reply to this email anytime for a personal update from our UK support team.";
      break;
    }
  }

  const itemsSummaryRows = items
    .map(
      (item) =>
        `<tr><td style="padding:5px 0;font-size:13px;color:#2E102F;">${escapeHtml(sanitizePublicText(item.name))}</td><td style="padding:5px 0;font-size:13px;color:#6E5A6F;text-align:right;font-weight:700;">x${item.quantity}</td></tr>`,
    )
    .join("");

  const itemsText = items
    .map((item) => `  - ${sanitizePublicText(item.name)} (x${item.quantity})`)
    .join("\n");

  const textBody = `Hi ${firstName},

${introText}

ORDER & LIVE TRACKING SUMMARY
- Order Reference: ${input.orderId}${input.orderDate ? ` (${input.orderDate})` : ""}${input.paidTotalDisplay ? `\n- Total Paid: ${input.paidTotalDisplay}` : ""}
${tracking ? `- Tracking Number: ${tracking} (${carrier})\n` : `- Carrier Assignment: ${carrier}\n`}- Latest Status: ${checkpoint}
- Destination: ${destination}
- Live Tracking Page: ${trackUrl}
Items:
${itemsText}

${nextStepText}

YOUR BUUDY CLEOPATRA EDITION MASK & ECO-FRIENDLY DIGITAL GUIDES
Your mask is the official Buudy 7 Colour LED Mask — Cleopatra Edition, calibrated by Cleopatra Phototherapy Labs. Because of this calibration lineage, you will see "Cleopatra" printed on the mask itself when unboxing (with Buudy Skincare UK handling all warranty & support).

To reduce unnecessary paper waste, there is no paper manual inside the box. Instead, we attached the PDF User Manual (${MANUAL_PDF_FILENAME}) directly to this email and included your digital links below:
- Step-by-Step How-To-Use Video: ${VIDEO_GUIDE_URL}
- Digital User Manual (PDF): ${MANUAL_PDF_URL}
- 40+ Page Skincare E-Book: ${EBOOK_URL}
- Buudy Glow Coach App: ${APP_URL}

Quick-Start Reminder Before First Use:
1. Charge via USB-C, then UNPLUG the cable completely (safety lockout prevents turning on while plugged in).
2. Flip the physical ON/OFF switch along the top inner edge to ON.
3. Gently tap the centre forehead area with a flat palm to turn on the LEDs.

Just reply directly to this email anytime if you need help — our UK Customer Care team is always happy to assist.

Warmest regards,
Customer Support Team
Buudy Skincare UK
support@buudy.co.uk | https://www.buudy.co.uk`;

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${escapeHtml(headline)}</title></head>
<body style="margin:0;padding:0;background-color:#F7F1E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2E102F;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F7F1E8;width:100%;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;background-color:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #EADDCE;box-shadow:0 6px 24px rgba(46,16,47,0.06);">
          <tr>
            <td style="padding:26px 32px 20px 32px;background:#FAF5EE;border-bottom:1px solid #EADDCE;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="font-size:24px;font-weight:800;letter-spacing:1px;color:#2E102F;">Buudy.</span>
                    <span style="font-size:12px;font-weight:700;letter-spacing:1.5px;color:#A87030;text-transform:uppercase;margin-left:8px;">Cleopatra&trade; Edition</span>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;background:#2E102F;color:#FAF5EE;padding:5px 12px;border-radius:999px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">${escapeHtml(badge)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px 0;font-size:16px;">Hi ${escapeHtml(firstName)},</p>
              ${introHtml}

              <div style="background:#FAF5EE;border:1px solid #EADDCE;border-radius:14px;padding:20px 22px;margin:20px 0;">
                <h3 style="margin:0 0 12px 0;font-size:13px;font-weight:800;color:#2E102F;text-transform:uppercase;letter-spacing:0.6px;">Order &amp; Live Status Summary</h3>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr><td style="padding:6px 0;font-size:13px;color:#6E5A6F;font-weight:600;width:155px;">Order Reference</td><td style="padding:6px 0;font-size:13px;color:#2E102F;font-weight:700;">${escapeHtml(input.orderId)}</td></tr>
                  ${input.orderDate ? `<tr><td style="padding:6px 0;font-size:13px;color:#6E5A6F;font-weight:600;">Order Date</td><td style="padding:6px 0;font-size:13px;color:#2E102F;font-weight:700;">${escapeHtml(input.orderDate)}</td></tr>` : ""}
                  ${input.paidTotalDisplay ? `<tr><td style="padding:6px 0;font-size:13px;color:#6E5A6F;font-weight:600;">Total Paid</td><td style="padding:6px 0;font-size:13px;color:#2E102F;font-weight:700;">${escapeHtml(input.paidTotalDisplay)}</td></tr>` : ""}
                  ${tracking ? `<tr><td style="padding:6px 0;font-size:13px;color:#6E5A6F;font-weight:600;">Tracking Number</td><td style="padding:6px 0;font-size:13px;color:#2E102F;font-weight:700;"><span style="font-family:monospace;">${escapeHtml(tracking)}</span> (${escapeHtml(carrier)})</td></tr>` : ""}
                  <tr><td style="padding:6px 0;font-size:13px;color:#6E5A6F;font-weight:600;">Latest Status</td><td style="padding:6px 0;font-size:13px;color:#2E102F;font-weight:700;">${escapeHtml(checkpoint)}</td></tr>
                  <tr><td style="padding:6px 0;font-size:13px;color:#6E5A6F;font-weight:600;">Destination</td><td style="padding:6px 0;font-size:13px;color:#2E102F;font-weight:700;">${escapeHtml(destination)}</td></tr>
                </table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;border-top:1px solid #EADDCE;padding-top:8px;">
                  ${itemsSummaryRows}
                </table>
                <div style="margin-top:16px;">
                  <a href="${escapeHtml(trackUrl)}" style="display:inline-block;background:#2E102F;color:#FAF5EE;text-decoration:none;padding:11px 22px;border-radius:999px;font-size:13px;font-weight:700;">Track Your Order Live</a>
                </div>
              </div>

              ${nextStepHtml}
              ${buildCleopatraAndManualHtml()}

              <p style="margin:18px 0 14px 0;font-size:14px;color:#5E4A5F;">Reply directly to this email anytime if you have any questions about your delivery or your skincare routine &mdash; we are here to help.</p>
              <p style="margin:0;font-size:15px;color:#2E102F;font-weight:600;">Warmest regards,</p>
              <p style="margin:4px 0 0 0;font-size:14px;color:#A87030;font-weight:700;">Customer Support Team<br><span style="font-weight:400;color:#6E5A6F;">Buudy Skincare UK &middot; <a href="https://www.buudy.co.uk" style="color:#A87030;text-decoration:none;">www.buudy.co.uk</a></span></p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#FAF5EE;border-top:1px solid #EADDCE;text-align:center;font-size:12px;color:#8E7A8F;">
              &copy; 2026 Buudy Skincare UK &middot; 13 Harefield Rd, Rickmansworth, England, WD3 1LY &middot; support@buudy.co.uk
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  if (
    BANNED_CONTENT_PATTERN.test(subject) ||
    BANNED_CONTENT_PATTERN.test(textBody) ||
    BANNED_CONTENT_PATTERN.test(htmlBody)
  ) {
    throw new Error(
      `Disallowed term detected while building lifecycle email for ${input.orderId}`,
    );
  }

  return {
    firstName,
    fullName,
    subject,
    textBody,
    htmlBody,
    eventKey: `${input.orderId}:${input.milestone}`,
  };
}

function isSmtpRateLimitError(message: string): boolean {
  return /(554|421|too many messages|rate[- ]?limit|quota)/i.test(message);
}

export async function sendSpacemailLifecycleEmail(
  input: LifecycleEmailInput,
  prefetchedSentEvents?: Set<string>,
): Promise<LifecycleSendResult> {
  const email = String(input.email || "").trim().toLowerCase();
  const eventKey = `${input.orderId}:${input.milestone}`;

  if (EXCLUDED_ORDER_IDS.has(input.orderId)) {
    return {
      ok: true,
      orderId: input.orderId,
      milestone: input.milestone,
      email,
      eventKey,
      sent: false,
      alreadySent: false,
      skippedReason: "excluded_order",
    };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      ok: false,
      orderId: input.orderId,
      milestone: input.milestone,
      email,
      eventKey,
      sent: false,
      alreadySent: false,
      fallbackSuggested: true,
      error: "Invalid recipient email",
    };
  }

  const creds = getSpacemailCredentials();
  if (!creds) {
    return {
      ok: false,
      orderId: input.orderId,
      milestone: input.milestone,
      email,
      eventKey,
      sent: false,
      alreadySent: false,
      fallbackSuggested: true,
      error: "Spacemail credentials not configured",
    };
  }

  const content = buildLifecycleEmailContent(input);

  if (!input.forceResend) {
    let dup = false;
    if (prefetchedSentEvents) {
      if (prefetchedSentEvents.has(eventKey)) {
        dup = true;
      } else if (
        input.milestone === "confirmed" &&
        Array.from(prefetchedSentEvents).some((k) =>
          k.startsWith(`${input.orderId}:catchup_`),
        )
      ) {
        dup = true;
      } else if (
        input.milestone === "delayed_checkin" &&
        (prefetchedSentEvents.has(`${input.orderId}:dispatched`) ||
          prefetchedSentEvents.has(`${input.orderId}:delivered`) ||
          Array.from(prefetchedSentEvents).some((k) =>
            k.startsWith(`${input.orderId}:catchup_`),
          ))
      ) {
        dup = true;
      }
    } else {
      try {
        dup = await hasSentEventInImap(input.orderId, input.milestone);
      } catch {
        // Proceed cleanly if IMAP dedup check transiently fails
      }
    }

    if (dup) {
      return {
        ok: true,
        orderId: input.orderId,
        milestone: input.milestone,
        email,
        eventKey,
        sent: false,
        alreadySent: true,
        skippedReason: "already_sent_in_imap",
        subject: content.subject,
      };
    }
  }

  if (input.dryRun) {
    return {
      ok: true,
      orderId: input.orderId,
      milestone: input.milestone,
      email,
      eventKey,
      sent: false,
      alreadySent: false,
      skippedReason: "dry_run",
      subject: content.subject,
    };
  }

  try {
    const pdfBuffer = await loadManualPdfBuffer();
    const messageId = `<buudy-${input.milestone}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}@buudy.co.uk>`;

    const composer = new MailComposer({
      from: { name: "Buudy Support", address: creds.user },
      to: { name: content.fullName, address: email },
      replyTo: creds.user,
      subject: content.subject,
      messageId,
      text: content.textBody,
      html: content.htmlBody,
      headers: {
        "X-Buudy-Event": eventKey,
        "X-Buudy-Order": input.orderId,
        "X-Buudy-Milestone": input.milestone,
      },
      attachments: [
        {
          filename: MANUAL_PDF_FILENAME,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    const rawMime = await new Promise<Buffer>((resolve, reject) => {
      composer.compile().build((err, message) => {
        if (err) reject(err);
        else resolve(message);
      });
    });

    const transporter = nodemailer.createTransport({
      host: SPACEMAIL_HOST,
      port: SPACEMAIL_SMTP_PORT,
      secure: true,
      auth: {
        user: creds.user,
        pass: creds.pass,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    const info = await transporter.sendMail({
      envelope: {
        from: creds.user,
        to: email,
      },
      raw: rawMime,
    });

    // Store copy in IMAP Sent with X-Buudy-Event header so zero-cost deduplication persists across deploys
    try {
      const session = await ImapSession.connect(10_000);
      try {
        await session.command(
          `LOGIN ${imapQuote(creds.user)} ${imapQuote(creds.pass)}`,
        );
        await session.appendSent(rawMime);
        prefetchedSentEvents?.add(eventKey);
      } finally {
        await session.close();
      }
    } catch (imapErr) {
      console.error(
        "[Spacemail] SMTP succeeded but IMAP Sent append failed:",
        imapErr instanceof Error ? imapErr.message : imapErr,
      );
    }

    return {
      ok: true,
      orderId: input.orderId,
      milestone: input.milestone,
      email,
      eventKey,
      sent: true,
      alreadySent: false,
      smtpResponse: info.response,
      messageId: info.messageId || messageId,
      subject: content.subject,
    };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const rateLimited = isSmtpRateLimitError(errMsg);
    return {
      ok: false,
      orderId: input.orderId,
      milestone: input.milestone,
      email,
      eventKey,
      sent: false,
      alreadySent: false,
      rateLimited,
      fallbackSuggested: true,
      subject: content.subject,
      error: errMsg,
    };
  }
}
