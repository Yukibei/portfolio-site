// Hero 人物区抠图素材：全部输出透明底 webp，深色站点下无可见图片边框。
// - portrait-base：正面真人（源已透明）
// - portrait-crt：正面 CRT 头（源黑底，BFS 从边界去连通黑色，保留屏幕内部暗区）
// - side-human / side-crt：两侧对立人物（源已透明）
import sharp from "sharp";

const SRC = "../图片";
const OUT = "public/hero";

async function passthrough(src, out, width = 1200) {
  await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(`${OUT}/${out}`);
}

// 从边界泛洪去掉与边界连通的黑色（外部黑底），保留被显示器灰色包围的屏幕暗区
async function knockoutBlack(src, out, { th = 44, width = 1200 } = {}) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const luma = (p) => 0.299 * data[p * 4] + 0.587 * data[p * 4 + 1] + 0.114 * data[p * 4 + 2];
  const seen = new Uint8Array(W * H);
  const q = [];
  const tryAdd = (p) => {
    if (p < 0 || p >= W * H || seen[p]) return;
    seen[p] = 1;
    if (luma(p) < th) {
      data[p * 4 + 3] = 0; // 透明
      q.push(p);
    }
  };
  for (let x = 0; x < W; x++) {
    tryAdd(x);
    tryAdd((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    tryAdd(y * W);
    tryAdd(y * W + W - 1);
  }
  while (q.length) {
    const p = q.pop();
    const x = p % W;
    const y = (p / W) | 0;
    if (x > 0) tryAdd(p - 1);
    if (x < W - 1) tryAdd(p + 1);
    if (y > 0) tryAdd(p - W);
    if (y < H - 1) tryAdd(p + W);
  }
  // 边缘羽化：对 alpha 轻微模糊，软化 BFS 硬切的锯齿
  await sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(`${OUT}/${out}`);
}

await passthrough(`${SRC}/a5536d86-2750-48dd-8b8c-68eef2dcca5e.png`, "portrait-base.webp");
await knockoutBlack(`${SRC}/图2.png`, "portrait-crt.webp");
await passthrough(`${SRC}/微信图片_20260614220140_129_17.png`, "side-human.webp");
await passthrough(`${SRC}/微信图片_20260614211601_125_17.png`, "side-crt.webp");

for (const n of ["portrait-base", "portrait-crt", "side-human", "side-crt"]) {
  const m = await sharp(`${OUT}/${n}.webp`).metadata();
  console.log(`${n}.webp  ${m.width}x${m.height}`);
}
