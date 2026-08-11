import { chromium } from "playwright";

const url = process.env.URL ?? "http://127.0.0.1:3000";
const screenshotPath =
  process.env.SCREENSHOT_PATH ?? "../logs/experience-layout.png";
const browser = await chromium.launch({ headless: true });
const desktopViewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 944 },
];

try {
  for (const viewport of desktopViewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });

    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(() => {
      document
        .querySelector("#experience")
        ?.scrollIntoView({ block: "start" });
    });
    await page.waitForSelector("canvas", { timeout: 30000 });
    await page.waitForTimeout(1600);

    const firstLabelBox = await page
      .locator("#experience span")
      .filter({ hasText: "Photos" })
      .nth(0)
      .boundingBox();
    if (!firstLabelBox) {
      throw new Error("First experience photos trigger was not found.");
    }
    await page.mouse.click(
      firstLabelBox.x + firstLabelBox.width / 2,
      firstLabelBox.y + firstLabelBox.height / 2
    );
    await page.waitForSelector("#experience figure", { timeout: 10000 });
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: screenshotPath.replace(".png", `-${viewport.name}.png`),
      fullPage: false,
    });

    const measurement = await page.evaluate(() => {
      const lanyard = document.querySelector(".experience-lanyard-safe-zone");
      const lanyardRect = lanyard?.getBoundingClientRect();
      const firstRow = document.querySelectorAll(
        '#experience [role="button"]'
      )[0];
      const photos = Array.from(document.querySelectorAll("#experience figure"));
      const labels = Array.from(
        document.querySelectorAll("#experience span")
      ).filter((element) => element.textContent?.includes("Photos"));
      const firstLabel = labels[0];
      const maxPhotoRight = Math.max(
        ...photos.map((element) => element.getBoundingClientRect().right)
      );
      const labelRight = firstLabel?.getBoundingClientRect().right ?? 0;
      const rowRight = firstRow?.getBoundingClientRect().right ?? 0;

      return {
        hasLanyard: Boolean(lanyardRect && lanyardRect.width > 0),
        labelRight,
        lanyardLeft: lanyardRect?.left ?? 0,
        lanyardRight: lanyardRect?.right ?? 0,
        maxPhotoRight,
        rowRight,
      };
    });

    const safeGap = 32;
    const contentRight = Math.max(
      measurement.maxPhotoRight,
      measurement.labelRight,
      measurement.rowRight
    );
    const allowedRight = measurement.lanyardLeft - safeGap;

    console.log(
      JSON.stringify({ allowedRight, measurement, safeGap, viewport }, null, 2)
    );

    if (!measurement.hasLanyard) {
      throw new Error(
        `Experience lanyard canvas was not rendered at ${viewport.width}px.`
      );
    }

    if (contentRight > allowedRight) {
      throw new Error(
        `Experience content overlaps lanyard zone at ${
          viewport.width
        }px: right=${contentRight.toFixed(1)}, allowed=${allowedRight.toFixed(
          1
        )}`
      );
    }

    await page.close();
  }
} finally {
  await browser.close();
}
