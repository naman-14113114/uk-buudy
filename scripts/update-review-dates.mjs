import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const daysArg = args.find((a) => a.startsWith("--days="));
const DAYS_TO_ADD = daysArg ? parseInt(daysArg.split("=")[1], 10) : 3;

if (Number.isNaN(DAYS_TO_ADD)) {
  console.error("Invalid days argument:", daysArg);
  process.exit(1);
}

console.log(`Advancing all product review dates by ${DAYS_TO_ADD} days...`);

function addDaysToYmd(ymd, days) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days, 12, 0, 0));
  const newY = dt.getUTCFullYear();
  const newM = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const newD = String(dt.getUTCDate()).padStart(2, "0");
  return `${newY}-${newM}-${newD}`;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function addDaysToIstDate(dateStr, days) {
  const parts = dateStr.trim().split(" ");
  const day = parseInt(parts[0], 10);
  const monthIdx = months.indexOf(parts[1]);
  const year = parseInt(parts[2], 10);
  const dt = new Date(Date.UTC(year, monthIdx, day + days, 12, 0, 0));
  return `${dt.getUTCDate()} ${months[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
}

function addDaysToIso(isoStr, days) {
  const dt = new Date(isoStr);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString();
}

const standardReviewFiles = [
  "src/data/reviews/buudy-hyaluronic-serum-reviews.json",
  "src/data/reviews/buudy-ipl-hair-removal-device-reviews.json",
  "src/data/reviews/buudy-led-mask-reviews.json",
  "src/data/reviews/buudy-red-torch-reviews.json",
];

let totalStandardUpdated = 0;

for (const relPath of standardReviewFiles) {
  const absPath = path.join(process.cwd(), relPath);
  const raw = await readFile(absPath, "utf8");
  const reviews = JSON.parse(raw);

  let minDateBefore = "9999";
  let maxDateBefore = "";
  let minDateAfter = "9999";
  let maxDateAfter = "";

  for (const review of reviews) {
    if (review.displayDate < minDateBefore) minDateBefore = review.displayDate;
    if (review.displayDate > maxDateBefore) maxDateBefore = review.displayDate;

    const newYmd = addDaysToYmd(review.displayDate, DAYS_TO_ADD);
    review.displayDate = newYmd;

    // Preserve time portion in "YYYY-MM-DD HH:mm:ss +0000 UTC"
    const timeMatch = review.date.match(/\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2}:\d{2}\s+\+0000\s+UTC)/);
    if (timeMatch) {
      review.date = `${newYmd}${timeMatch[1]}`;
    } else {
      review.date = `${newYmd} 00:00:00 +0000 UTC`;
    }

    if (newYmd < minDateAfter) minDateAfter = newYmd;
    if (newYmd > maxDateAfter) maxDateAfter = newYmd;
  }

  await writeFile(absPath, JSON.stringify(reviews, null, 2) + "\n", "utf8");
  totalStandardUpdated += reviews.length;
  console.log(`Updated ${reviews.length} reviews in ${path.basename(relPath)}:`);
  console.log(`  Before: min=${minDateBefore}, max=${maxDateBefore}`);
  console.log(`  After:  min=${minDateAfter}, max=${maxDateAfter}`);
}

// Update organic reviews
const orgPath = path.join(process.cwd(), "src/data/reviews/customer_org_review.json");
const orgRaw = await readFile(orgPath, "utf8");
const orgReviews = JSON.parse(orgRaw);

for (const review of orgReviews) {
  if (review.dateIST) {
    review.dateIST = addDaysToIstDate(review.dateIST, DAYS_TO_ADD);
  }
  if (review.submittedAtIST) {
    const timePart = review.submittedAtIST.split(",")[1];
    review.submittedAtIST = `${review.dateIST},${timePart}`;
  }
  if (review.createdAtISO) {
    review.createdAtISO = addDaysToIso(review.createdAtISO, DAYS_TO_ADD);
  }
}

await writeFile(orgPath, JSON.stringify(orgReviews, null, 2) + "\n", "utf8");
console.log(`Updated ${orgReviews.length} organic customer reviews in customer_org_review.json.`);
console.log(`Total reviews updated: ${totalStandardUpdated + orgReviews.length}.`);
