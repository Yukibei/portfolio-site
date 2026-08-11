// 把用户提供的真实项目截图处理成项目卡所需的 a/b/tall 三张图（覆盖占位图，文件名不变）。
// a/b 为横版/方图（左列双格），tall 为竖版（右列满高）。ReflexLearn 无竖版素材，
// 用三屏拼接成竖版产品巡览，底色与卡片背景 #101010 一致，观感统一。
import sharp from "sharp";

const SRC = "../图片"; // 相对 web/ 目录
const OUT = "public/projects";
const CARD_BG = { r: 16, g: 16, b: 16, alpha: 1 }; // #101010 与项目卡背景一致

const png = (b) => sharp(b).png({ compressionLevel: 9 });

async function landscape(src, out, width = 1400) {
  await sharp(src).resize({ width, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(`${OUT}/${out}`);
}
async function portrait(src, out, width = 820) {
  await sharp(src).resize({ width, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(`${OUT}/${out}`);
}

// —— Hoop Pupil ——
await landscape(`${SRC}/智瞳篮途/65b1b6db22a7517599dae9f65df5c8c0.jpg`, "hp-a.png");
await landscape(`${SRC}/智瞳篮途/1a616024f78d95f441ee4941face35b9.jpg`, "hp-b.png", 1200);
await portrait(`${SRC}/智瞳篮途/3946bd4f8dd400b5825ab6a013879f63.jpg`, "hp-tall.png");

// —— ReflexLearn ——
await landscape(`${SRC}/反思学习/0b5a67a7-5ed0-40af-9b09-17d2a352eeb2.png`, "rl-a.png");
await landscape(`${SRC}/反思学习/595c8c04-aaff-4366-9bf5-3dc1c9f241fc.png`, "rl-b.png");

// rl-tall：三屏竖版拼接（学习路径 / 资源库 / 成长档案）
{
  const shots = [
    `${SRC}/反思学习/4c4e6719-22e0-4d17-83e3-0fd391a36494.png`,
    `${SRC}/反思学习/924fdb2c-4a83-4beb-bbc9-476d84889ecb.png`,
    `${SRC}/反思学习/edd88def-cab3-4ff6-bc81-63845e3c37cd.png`,
  ];
  const IMG_W = 760;
  const TOP = 40;
  const GAP = 37;
  const resized = await Promise.all(
    shots.map((s) =>
      sharp(s)
        .resize({ width: IMG_W })
        .png()
        .toBuffer({ resolveWithObject: true })
    )
  );
  const h = resized[0].info.height;
  const canvasW = 820;
  const sidePad = Math.round((canvasW - IMG_W) / 2);
  const canvasH = TOP * 2 + h * 3 + GAP * 2;
  const layers = resized.map((r, i) => ({
    input: r.data,
    top: TOP + i * (h + GAP),
    left: sidePad,
  }));
  await sharp({ create: { width: canvasW, height: canvasH, channels: 4, background: CARD_BG } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/rl-tall.png`);
}

// —— OpenClaw ——
await landscape(`${SRC}/智瞳篮途/ac66847479fd99c246d8a15778caeb75.jpg`, "oc-a.png");
await landscape(`${SRC}/智瞳篮途/b982520fb657976fcc5e90f7275a801b.jpg`, "oc-b.png");
await portrait(`${SRC}/智瞳篮途/c282c539d7c7a4e8568f8fce2bb0e0b5.jpg`, "oc-tall.png");

// 输出尺寸核对
const names = ["hp-a", "hp-b", "hp-tall", "rl-a", "rl-b", "rl-tall", "oc-a", "oc-b", "oc-tall"];
for (const n of names) {
  const m = await sharp(`${OUT}/${n}.png`).metadata();
  console.log(`${n}.png  ${m.width}x${m.height}`);
}
