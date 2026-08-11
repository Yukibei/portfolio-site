import { mkdir, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const SRC = "../图片";
const OUT = "public/projects";

const videos = [
  {
    input: `${SRC}/智瞳篮途/智瞳篮途视频.mp4`,
    output: "hp-demo.mp4",
    poster: "hp-demo-poster.jpg",
    trim: ["-t", "90"],
    scale: "1280:-2",
    crf: "30",
  },
  {
    input: `${SRC}/智瞳篮途/小龙虾视频.mp4`,
    output: "oc-demo.mp4",
    poster: "oc-demo-poster.jpg",
    scale: "1280:-2",
    crf: "30",
  },
  {
    input: `${SRC}/反思学习/80e6f6a104b1e76c9beabb3d7ac3f7dd.mp4`,
    output: "rl-demo.mp4",
    poster: "rl-demo-poster.jpg",
    scale: "1280:-2",
    crf: "29",
  },
];

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

await mkdir(OUT, { recursive: true });

for (const video of videos) {
  const output = path.join(OUT, video.output);
  const poster = path.join(OUT, video.poster);
  const baseArgs = [
    "-y",
    ...(video.trim ?? []),
    "-i",
    video.input,
    "-vf",
    `scale=${video.scale}`,
    "-an",
    "-c:v",
    "libx264",
    "-profile:v",
    "main",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "veryfast",
    "-crf",
    video.crf,
    "-movflags",
    "+faststart",
    output,
  ];
  await run("ffmpeg", baseArgs);

  await run("ffmpeg", [
    "-y",
    "-ss",
    "2",
    "-i",
    video.input,
    "-frames:v",
    "1",
    "-vf",
    `scale=${video.scale}`,
    "-q:v",
    "4",
    "-update",
    "1",
    poster,
  ]);

  const outputStat = await stat(output);
  const posterStat = await stat(poster);
  console.log(
    `${video.output} ${(outputStat.size / 1024 / 1024).toFixed(1)}MB · ${video.poster} ${Math.round(
      posterStat.size / 1024,
    )}KB`,
  );
}
