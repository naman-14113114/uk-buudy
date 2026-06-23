const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const outDir = path.join(__dirname, "compact-shots");
  fs.mkdirSync(outDir, { recursive: true });

  try {
    const results = [];

    for (const cfg of [
      { name: "desktop", width: 1440, height: 900, scale: 1, mobile: false },
      { name: "mobile", width: 390, height: 844, scale: 2, mobile: true },
    ]) {
      const page = await browser.newPage({
        viewport: { width: cfg.width, height: cfg.height },
        deviceScaleFactor: cfg.scale,
        isMobile: cfg.mobile,
      });

      await page.goto("http://127.0.0.1:3017/products/buudy-led-mask-compact", {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.getByText("Change 7 light modes", { exact: false }).waitFor({
        timeout: 30000,
      });
      await page.getByRole("heading", { name: /Dr\. Gabriella/ }).waitFor({
        timeout: 30000,
      });

      const metrics = await page.evaluate(() => {
        const sections = Array.from(document.querySelectorAll("section")).map(
          (section, index) => {
            const rect = section.getBoundingClientRect();
            const text = (section.textContent || "").replace(/\s+/g, " ").trim();
            let label = text.slice(0, 72);
            if (section.id) label = `#${section.id} ${label}`;

            return {
              index,
              y: Math.round(rect.top + window.scrollY),
              height: Math.round(rect.height),
              label,
            };
          },
        );

        return {
          viewportHeight: window.innerHeight,
          headerPosition: getComputedStyle(document.querySelector("header")).position,
          wavelength: sections.find((section) =>
            section.label.includes("Change 7 light modes"),
          ),
          expert: sections.find((section) => section.label.includes("Dr. Gabriella")),
          reviews: sections.find((section) => section.label.includes("#reviews")),
          comparison: sections.find((section) =>
            section.label.includes("What makes Buudy"),
          ),
        };
      });

      await page
        .locator("section", { hasText: "Change 7 light modes" })
        .scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(outDir, `${cfg.name}-wavelength.png`),
        fullPage: false,
      });

      await page.locator("section#expert").scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(outDir, `${cfg.name}-expert.png`),
        fullPage: false,
      });

      results.push({ name: cfg.name, metrics });
      await page.close();
    }

    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
})();
