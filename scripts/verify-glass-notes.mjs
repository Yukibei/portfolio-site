import { chromium } from "../web/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const baseUrl = process.env.NOTES_BASE_URL ?? "http://127.0.0.1:3001";
const outputDir = new URL("../output/glass-notes-qa/", import.meta.url);
const outputPath = fileURLToPath(outputDir);
await fs.mkdir(outputPath, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));

async function open(path) {
  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
}

const breakpoints = [1440, 1130, 900, 680, 520];
for (const width of breakpoints) {
  await page.setViewportSize({ width, height: 900 });
  await open("/notes");
  const rail = page.getByRole("navigation", { name: "笔记系统导航" });
  const direction = await rail.evaluate((element) => getComputedStyle(element).flexDirection);
  const expected = width <= 1130 ? "row" : "column";
  if (direction !== expected) throw new Error(`${width}px rail 方向应为 ${expected}，实际为 ${direction}`);
  if (await page.locator("#contact").isVisible()) throw new Error(`${width}px 不应显示全站 Footer`);
  await page.screenshot({ path: `${outputPath}/notes-${width}.png`, fullPage: true });
}

await page.setViewportSize({ width: 1440, height: 900 });
const routes = [
  ["/notes/favorites", "收藏", "收藏"],
  ["/notes/queue", "稍后读", "稍后读"],
  ["/notes/profile", "个人主页", "个人主页"],
  ["/notes/settings", "设置", "设置"],
  ["/notes/notifications", "提醒中心", null],
  ["/notes/series/portfolio-v2", "个人站 V2 工程实录", null],
];
for (const [path, title, railLabel] of routes) {
  await open(path);
  await page.getByRole("heading", { name: title }).first().waitFor();
  if (railLabel) {
    const current = page.getByRole("link", { name: railLabel }).first();
    if ((await current.getAttribute("aria-current")) !== "page") throw new Error(`${path} rail 未高亮`);
  }
  await page.screenshot({ path: `${outputPath}/${path.replaceAll("/", "-").slice(1)}.png`, fullPage: true });
}

await open("/notes/portfolio-as-a-system");
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await page.waitForTimeout(600);
await open("/notes");
await page.getByRole("button", { name: "收藏" }).first().click();
await page.getByRole("button", { name: "稍后读" }).first().click();
await open("/notes/favorites");
await page.getByText("为什么把个人站从单页改成作品集系统").first().waitFor();
await open("/notes/queue");
await page.getByText("为什么把个人站从单页改成作品集系统").first().waitFor();

await open("/notes");
const search = page.getByRole("textbox", { name: "搜索笔记" });
await search.fill("CAD");
await search.press("Enter");
await page.waitForURL(/query=CAD/);
await page.getByText("CAD 语义审查：每一个结论都要能回到证据").first().waitFor();

await open("/notes/settings");
page.once("dialog", (dialog) => dialog.accept());
await page.getByRole("button", { name: "清除全部数据" }).click();
await page.getByRole("status").getByText("已清除收藏、稍后读、阅读进度和阅读偏好").waitFor();
await open("/notes/favorites");
await page.getByText("收藏列表还是空的").waitFor();

await browser.close();
if (errors.length > 0) throw new Error(`浏览器错误：\n${errors.join("\n")}`);
console.log(`玻璃笔记验证通过，截图输出：${outputPath}`);
