"""Build the customer-facing Buudy skincare guide PDF.

Run with the workspace Python runtime: python scripts/build-skincare-guide.py
"""

from pathlib import Path
import shutil

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "Buudy-Clinical-Skincare-Masterclass-Guide.pdf"
LOGO = PUBLIC / "media/products/buudy-led-mask/images/ChatGPT Image May 31, 2026, 12_10_21 AM.png"
PRODUCT = PUBLIC / "images/products/buudy-led-mask/01-buudy-led-mask-front.webp"
W, H = A4
PLUM = colors.HexColor("#3b203d")
GOLD = colors.HexColor("#ac8b4b")
CREAM = colors.HexColor("#f7f1e8")
BLUSH = colors.HexColor("#f0ded5")
INK = colors.HexColor("#2f2830")
MUTED = colors.HexColor("#665b65")
RULE = colors.HexColor("#decfc0")

pdfmetrics.registerFont(TTFont("Georgia", "C:/Windows/Fonts/georgia.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Bold", "C:/Windows/Fonts/georgiab.ttf"))
pdfmetrics.registerFont(TTFont("Arial", "C:/Windows/Fonts/arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", "C:/Windows/Fonts/arialbd.ttf"))

STYLES = {
    "body": ParagraphStyle("body", fontName="Arial", fontSize=10.5, leading=16, textColor=INK, alignment=TA_LEFT),
    "small": ParagraphStyle("small", fontName="Arial", fontSize=8.8, leading=13.2, textColor=MUTED),
    "white": ParagraphStyle("white", fontName="Arial", fontSize=10.5, leading=16, textColor=CREAM),
    "bold": ParagraphStyle("bold", fontName="Arial-Bold", fontSize=10.5, leading=16, textColor=PLUM),
}


def para(c, text, x, top, width, style="body"):
    obj = Paragraph(text, STYLES[style])
    _, height = obj.wrap(width, H)
    obj.drawOn(c, x, top - height)
    return top - height


def label(c, text, x, y, color=GOLD):
    c.setFillColor(color)
    c.setFont("Arial-Bold", 8.2)
    c.drawString(x, y, text.upper())


def title(c, eyebrow, heading, deck, page):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(PLUM)
    c.rect(0, H - 13, W, 13, fill=1, stroke=0)
    c.drawImage(ImageReader(str(LOGO)), 40, H - 83, width=122, height=41, preserveAspectRatio=True, mask="auto")
    label(c, eyebrow, 41, H - 116)
    c.setFillColor(PLUM)
    c.setFont("Georgia", 30)
    c.drawString(40, H - 159, heading)
    y = para(c, deck, 42, H - 181, W - 84, "body")
    c.setStrokeColor(RULE)
    c.line(40, y - 20, W - 40, y - 20)
    footer(c, page)
    return y - 43


def footer(c, page):
    c.setStrokeColor(RULE)
    c.line(40, 48, W - 40, 48)
    label(c, "BUUDY  /  YOUR LIGHT ROUTINE", 40, 34, PLUM)
    c.setFillColor(MUTED)
    c.setFont("Arial", 8)
    c.drawRightString(W - 40, 34, f"{page:02d}  /  08")


def heading(c, text, x, y, size=18):
    c.setFillColor(PLUM)
    c.setFont("Georgia", size)
    c.drawString(x, y, text)


def card(c, x, top, width, height, number, heading_text, body):
    c.setFillColor(colors.white)
    c.roundRect(x, top - height, width, height, 12, fill=1, stroke=0)
    c.setStrokeColor(RULE)
    c.roundRect(x, top - height, width, height, 12, fill=0, stroke=1)
    label(c, number, x + 19, top - 27)
    heading(c, heading_text, x + 19, top - 54, 16)
    para(c, body, x + 19, top - 68, width - 38, "small")


def build():
    c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
    c.setTitle("Buudy Your Light Routine | Customer Skincare Guide")
    c.setAuthor("Buudy")

    # 1. Cover: an actual brand mark, product and useful promise.
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(PLUM)
    c.rect(0, 0, W, 152, fill=1, stroke=0)
    c.drawImage(ImageReader(str(LOGO)), 43, H - 104, width=172, height=58, preserveAspectRatio=True, mask="auto")
    label(c, "THE BUUDY CUSTOMER GUIDE", 45, H - 144)
    heading(c, "Your light routine", 44, H - 207, 37)
    heading(c, "starts here.", 44, H - 251, 37)
    para(c, "A clear first-week plan for using your Buudy LED Mask with confidence, simple skincare, and room to notice what works for you.", 46, H - 282, 251)
    photo = Image.open(PRODUCT).convert("RGB")
    photo.thumbnail((320, 370))
    c.setFillColor(BLUSH)
    c.roundRect(309, 225, 242, 374, 15, fill=1, stroke=0)
    c.drawImage(ImageReader(photo), 318, 234, width=224, height=356, preserveAspectRatio=True, anchor="c", mask="auto")
    c.setFillColor(CREAM)
    c.setFont("Georgia", 18)
    c.drawString(44, 102, "Less guesswork. A gentler start.")
    c.setFont("Arial", 9.5)
    c.drawString(45, 76, "Read alongside your device manual  |  buudy.co.uk")
    c.showPage()

    # 2. Quick start.
    y = title(c, "01 / BEFORE YOU BEGIN", "Start with three steps", "You do not need a complicated treatment calendar. Begin with the instructions that came with your device and a routine you can actually repeat.", 2)
    card(c, 40, y, 244, 171, "01  CHECK", "Read the manual", "Confirm your model's session length, frequency, fit, charging instructions and eye protection. The manual takes priority over general advice in this guide.")
    card(c, 311, y, 244, 171, "02  PREPARE", "Keep skin simple", "Cleanse gently and dry your face. Skip unfamiliar products immediately before a session. If your skin is irritated, let it settle first.")
    card(c, 40, y - 193, 515, 142, "03  NOTICE", "Make one small observation", "After a session, note comfort, skin feel and the mode you used. You are looking for a routine that feels sustainable, not instant transformation.")
    c.setFillColor(BLUSH)
    c.roundRect(40, y - 455, 515, 92, 12, fill=1, stroke=0)
    para(c, "<b>Already have a skin condition, take medication that may increase light sensitivity, or have a history of light-triggered symptoms?</b> Check with a qualified healthcare professional before starting. Stop if you feel discomfort.", 58, y - 381, 480, "small")
    c.showPage()

    # 3. Choosing a mode.
    y = title(c, "02 / A SIMPLE WAY TO CHOOSE", "One starting mode is enough", "The quiz suggests a place to begin. It does not diagnose your skin or guarantee a particular result. Use the modes named in your device manual.", 3)
    rows = [
        ("Breakouts or oiliness", "Blue", "Use the quiz suggestion as a starting point. Keep the rest of your routine gentle."),
        ("Fine lines or firmness", "Red", "Track comfort and consistency before making changes to your routine."),
        ("Uneven-looking tone", "Green", "Keep daytime sun protection in your routine; it matters more than chasing modes."),
        ("Dull-looking skin", "Yellow", "Keep the rest of your routine familiar and note how your skin feels."),
    ]
    for i, (goal, mode, note) in enumerate(rows):
        top = y - i * 94
        c.setFillColor(colors.white if i % 2 == 0 else BLUSH)
        c.roundRect(40, top - 80, 515, 80, 9, fill=1, stroke=0)
        label(c, goal, 57, top - 23, PLUM)
        heading(c, mode, 57, top - 51, 17)
        para(c, note, 229, top - 18, 305, "small")
    para(c, "<b>If your skin is reactive or redness-prone:</b> Ask a qualified healthcare professional before starting LED use. The mask may offer other settings, including near-infrared, but there is no need to rotate through every colour in the first week.", 43, y - 403, 505, "body")
    c.showPage()

    # 4. Five-day plan.
    y = title(c, "03 / YOUR FIRST FIVE DAYS", "A rhythm you can repeat", "Use the quiz result for your starting mode. The session days below are examples only; adjust to the frequency in your own device instructions.", 4)
    days = [
        ("01", "Get comfortable", "Read the manual, fit the mask, and try one session only if it is suitable for you."),
        ("02", "Give skin a rest", "Cleanse, moisturise and notice how your skin feels."),
        ("03", "Repeat simply", "Use the same mode if day one felt comfortable. Avoid changing several things at once."),
        ("04", "Keep the basics", "A rest day is still part of a useful routine. Continue gentle skincare."),
        ("05", "Review and decide", "Look back at your notes. Keep a comfortable rhythm that follows the manual."),
    ]
    for i, (day, name, detail) in enumerate(days):
        top = y - i * 91
        c.setFillColor(PLUM if i in (0, 4) else colors.white)
        c.roundRect(40, top - 78, 515, 78, 10, fill=1, stroke=0)
        light = i in (0, 4)
        label(c, f"DAY {day}", 58, top - 23, GOLD if light else PLUM)
        c.setFont("Georgia", 17)
        c.setFillColor(CREAM if light else PLUM)
        c.drawString(58, top - 47, name)
        para(c, detail, 244, top - 17, 291, "white" if light else "small")
    c.showPage()

    # 5. Skincare basics.
    y = title(c, "04 / AROUND A SESSION", "Keep skincare uncomplicated", "The most helpful routine is one you can maintain without irritating your skin.", 5)
    card(c, 40, y, 515, 125, "BEFORE", "Clean and dry", "Use a familiar gentle cleanser. Remove makeup and allow skin to dry. Avoid trying a new strong active immediately before a light session.")
    card(c, 40, y - 143, 515, 125, "AFTER", "Comfort first", "If your skin feels comfortable, finish with a moisturiser you already tolerate. If it feels hot, sore or unusually irritated, stop using the device and seek advice.")
    card(c, 40, y - 286, 515, 125, "DAYTIME", "Protect your skin", "Use shade and suitable clothing as well as sunscreen. NHS guidance recommends at least SPF 30 with UVA protection when sun protection is needed.")
    para(c, "<b>Keep regular treatment separate:</b> LED routines do not replace prescribed treatments, acne care, or advice from your clinician. If you use prescription skincare, ask the prescriber how to fit light sessions around it.", 45, y - 438, 505, "body")
    c.showPage()

    # 6. Quiz interpretation.
    y = title(c, "05 / MAKE THE QUIZ USEFUL", "Your answer is a starting point", "Your result should tell you what to try first and why. It cannot tell you what your skin will look like in a fixed number of days.", 6)
    card(c, 40, y, 515, 118, "IF YOU CHOSE MORE THAN ONE CONCERN", "Pick a priority", "Start with the concern that matters most today. You can revisit the other one after you know the first mode feels comfortable.")
    card(c, 40, y - 136, 515, 118, "IF YOUR SKIN IS REACTIVE", "Slow down", "A rest day or a shorter, manual-approved session may be more useful than adding more modes. Stop if discomfort occurs.")
    card(c, 40, y - 272, 515, 118, "IF YOUR SCHEDULE CHANGES", "Keep an anchor", "Choose a time that fits your week. Exact clock times are less useful than following the device instructions consistently.")
    c.setFillColor(BLUSH)
    c.roundRect(40, y - 487, 515, 74, 12, fill=1, stroke=0)
    para(c, "<b>A good first-week question:</b> Which part of this routine felt easy enough to repeat next week? Use that answer before adding another step.", 58, y - 429, 479, "body")
    c.showPage()

    # 7. Care and troubleshooting.
    y = title(c, "06 / LOOK AFTER YOUR MASK", "Small habits matter", "Keep the device comfortable to use and easy to find. Refer to the supplied manual for model-specific cleaning and charging steps.", 7)
    card(c, 40, y, 244, 151, "AFTER USE", "Clean carefully", "Switch the device off. Clean only as the manual directs, then let it dry before storing.")
    card(c, 311, y, 244, 151, "BETWEEN SESSIONS", "Store it safely", "Keep the mask and eye protection together in a dry, protected place.")
    card(c, 40, y - 169, 515, 145, "IF SOMETHING FEELS WRONG", "Pause, then check", "Check fit, comfort, eye protection and the manual. Do not force another session if you have pain, a headache, or irritation. Contact support if the device itself is not working as expected.")
    para(c, "<b>Buudy support:</b> support@buudy.co.uk<br/><b>Companion app:</b> app.buudy.com<br/><b>Shop:</b> www.buudy.co.uk", 45, y - 351, 485, "body")
    c.showPage()

    # 8. Practical log and sources.
    y = title(c, "07 / TAKE THIS WITH YOU", "Your first-week notes", "Use this page on paper or save a copy on your device. Recording comfort is more useful than judging day-to-day appearance.", 8)
    cols = [40, 99, 245, 390, 555]
    label(c, "DAY", 48, y - 24, PLUM)
    label(c, "MODE / REST", 108, y - 24, PLUM)
    label(c, "COMFORT", 254, y - 24, PLUM)
    label(c, "ONE OBSERVATION", 399, y - 24, PLUM)
    for i in range(5):
        top = y - 37 - i * 55
        c.setFillColor(colors.white if i % 2 == 0 else BLUSH)
        c.rect(40, top - 50, 515, 50, fill=1, stroke=0)
        c.setFillColor(PLUM)
        c.setFont("Georgia", 14)
        c.drawString(49, top - 31, str(i + 1))
        for x in cols[1:-1]:
            c.setStrokeColor(RULE)
            c.line(x, top - 41, x + (125 if x != 390 else 150), top - 41)
    label(c, "READ MORE", 42, y - 366)
    para(c, "For general home LED safety and realistic expectations: American Academy of Dermatology, <u>Is red light therapy right for your skin?</u> (aad.org/public/cosmetic/safety/red-light-therapy). For UK sun protection: NHS, <u>Sunscreen and sun safety</u> (nhs.uk/live-well/seasonal-health/sunscreen-and-sun-safety/).", 42, y - 378, 510, "small")
    para(c, "This is cosmetic and wellbeing information, not a diagnosis or a replacement for your device manual or professional care. Product modes, session length and precautions should be confirmed against the instructions supplied with your mask.", 42, y - 463, 510, "small")
    c.showPage()
    c.save()

    for alias in ["Buudy-Clinical-Masterclass-EBook.pdf", "Buudy-Clinical-Masterclass-EBook-v2.pdf"]:
        target = PUBLIC / alias
        shutil.copyfile(OUT, target)

    # Use the finished cover as the image wherever the guide appears on the shop.
    # Poppler rendering is handled by the caller; no image processing of old art.


if __name__ == "__main__":
    build()
