import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const url = process.argv[2];

if (!url) {
  throw new Error("Missing URL argument for loading gate verification.");
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
  await page.screenshot({
    path: resolve(logDir, "verify-loading-gate-initial.png"),
    fullPage: false,
  });

  const dinoVisible = await page.locator(".dino-loader").isVisible();
  if (!dinoVisible) {
    throw new Error("Expected the dino loader to be visible on first paint.");
  }

  const enterButtonCount = await page
    .getByRole("button", { name: /enter/i })
    .count();
  if (enterButtonCount > 0) {
    throw new Error("Loading gate still exposes an Enter button.");
  }

  const gate = page.locator("[data-loading-gate]");
  const gateText = await gate.innerText();
  if (/Loading assets|\d+%/i.test(gateText)) {
    throw new Error("Loading gate still exposes progress text.");
  }

  await page.waitForFunction(
    () => !document.querySelector(".dino-loader") && document.body.style.overflow !== "hidden",
    null,
    { timeout: 4500 },
  );

  await page.screenshot({
    path: resolve(logDir, "verify-loading-gate-after.png"),
    fullPage: false,
  });

  console.log(`Loading gate verified at ${url}`);
} finally {
  await browser.close();
}
