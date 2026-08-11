import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const url = process.argv[2];

if (!url) {
  throw new Error("Missing URL argument for portrait stage verification.");
}

const repoRoot = resolve(process.cwd(), "..");
const logDir = resolve(repoRoot, "logs");
await mkdir(logDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(90000);
page.setDefaultNavigationTimeout(90000);

try {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-portrait-stage]");
  await page.waitForSelector("canvas");
  await page.waitForSelector("canvas[data-reveal-mode='hover-mask']");
  await page.waitForSelector("canvas[data-stage-ready='true']");

  const bodyText = await page.locator("body").innerText();
  const normalizedBodyText = bodyText.toLowerCase();
  for (const text of ["YILING LI", "AI AGENT", "LangGraph", "ReID", "91.61", "move cursor"]) {
    if (!normalizedBodyText.includes(text.toLowerCase())) {
      throw new Error(`Expected portrait stage text missing: ${text}`);
    }
  }

  const canvasBox = await page.locator("canvas").boundingBox();
  if (!canvasBox || canvasBox.width < 600 || canvasBox.height < 400) {
    throw new Error(`Portrait stage canvas is too small: ${JSON.stringify(canvasBox)}`);
  }

  await page.waitForTimeout(500);
  await page.screenshot({
    path: resolve(logDir, "portrait-stage-desktop-initial.png"),
    fullPage: false,
  });

  await page.mouse.move(680, 300);
  await page.mouse.move(820, 350, { steps: 16 });
  await page.mouse.move(610, 390, { steps: 16 });
  await page.mouse.move(780, 330, { steps: 16 });
  await page.waitForTimeout(900);
  await page.screenshot({
    path: resolve(logDir, "portrait-stage-desktop-reveal.png"),
    fullPage: false,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-portrait-stage]");
  await page.screenshot({
    path: resolve(logDir, "portrait-stage-mobile.png"),
    fullPage: false,
  });

  console.log(`Portrait stage verified at ${url}`);
} finally {
  await browser.close();
}
