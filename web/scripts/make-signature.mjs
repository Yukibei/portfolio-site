// 把手写签名源图（黑墨/米色纸）转成「白墨 + 透明背景」，适配深色作品集。
// 思路：灰度 → alpha = 反相后做 levels（压掉纸面噪声、提亮墨迹）→ 颜色全白。
import sharp from "sharp";

const SRC = "public/lab/portrait-stage/signature-source.png";
const OUT = "public/hero/signature.png";

// levels 参数：floor 以下视为纸（透明），ceil 以上视为实墨（不透明）
const FLOOR = 55;
const CEIL = 200;

const base = sharp(SRC).trim({ threshold: 28 }); // 裁掉四周纸边
const gray = await base
  .clone()
  .grayscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { data, info } = gray;
const { width, height } = info;
const rgba = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  const g = data[i]; // 0=墨 255=纸
  let a = 255 - g; // 墨→高 alpha，纸→低 alpha
  a = Math.round(((a - FLOOR) / (CEIL - FLOOR)) * 255);
  a = Math.max(0, Math.min(255, a));
  rgba[i * 4] = 255;
  rgba[i * 4 + 1] = 255;
  rgba[i * 4 + 2] = 255;
  rgba[i * 4 + 3] = a;
}

await sharp(rgba, { raw: { width, height, channels: 4 } })
  .trim({ threshold: 1 }) // 再裁一次透明边
  .resize({ width: 1000, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`signature -> ${OUT}  ${meta.width}x${meta.height}`);
