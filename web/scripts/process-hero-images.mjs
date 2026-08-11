// 处理 hero 肖像揭示素材：中文文件名 → ASCII，PNG → WebP 优化体积。
// 中文路径用 Read/Write 工具写进本脚本（UTF-8 安全），避免命令行传参乱码。
import fs from "node:fs";
import path from "node:path";

const SRC_DIR = "D:/2026/A11/portfolio-site/图片";
const OUT_DIR = "D:/2026/A11/portfolio-site/web/public/hero";
fs.mkdirSync(OUT_DIR, { recursive: true });

const jobs = [
  ["一号.png", "portrait-base"],
  ["图2.png", "portrait-crt"],
];

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  sharp = null;
}

for (const [src, name] of jobs) {
  const buf = fs.readFileSync(path.join(SRC_DIR, src));
  if (sharp) {
    await sharp(buf).webp({ quality: 90 }).toFile(path.join(OUT_DIR, `${name}.webp`));
    const { size } = fs.statSync(path.join(OUT_DIR, `${name}.webp`));
    console.log(`${name}.webp  ${(size / 1024).toFixed(0)}KB`);
  } else {
    fs.writeFileSync(path.join(OUT_DIR, `${name}.png`), buf);
    console.log(`${name}.png (sharp 不可用，原样复制)`);
  }
}
console.log("done");
