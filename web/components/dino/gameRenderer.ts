import type { GameAssets } from "./gameAssets";
import type { ObstacleState, RenderState } from "./gameEngine";

const STAR_POSITIONS = [
  [0.09, 0.16, 0],
  [0.22, 0.29, 1],
  [0.36, 0.13, 2],
  [0.51, 0.3, 0],
  [0.65, 0.18, 1],
  [0.78, 0.32, 2],
  [0.9, 0.2, 0],
] as const;

function setNightFilter(context: CanvasRenderingContext2D, night: boolean): void {
  context.filter = night ? "brightness(0) invert(1)" : "none";
}

function drawBackground(
  context: CanvasRenderingContext2D,
  state: RenderState,
  assets: GameAssets,
): void {
  context.fillStyle = state.night ? "#050505" : "#f4f4ef";
  context.fillRect(0, 0, state.width, state.height);
  setNightFilter(context, state.night);

  if (state.night) {
    for (const [xRatio, yRatio, index] of STAR_POSITIONS) {
      const star = assets.stars[index];
      const scale = state.sceneScale * 1.5;
      context.drawImage(
        star,
        state.width * xRatio,
        state.height * yRatio,
        star.naturalWidth * scale,
        star.naturalHeight * scale,
      );
    }
    const moon = assets.moons[state.moonPhase];
    const scale = state.sceneScale * 1.65;
    context.drawImage(
      moon,
      state.width - 86 * state.sceneScale,
      26 * state.sceneScale,
      moon.naturalWidth * scale,
      moon.naturalHeight * scale,
    );
  } else {
    const cloudScale = state.sceneScale;
    const travel = state.travel * 0.05;
    const cloudTrack = state.width + 160;
    for (const [base, y] of [[0.18, 0.2], [0.55, 0.3], [0.86, 0.15]] as const) {
      const x = ((state.width * base - travel) % cloudTrack + cloudTrack) % cloudTrack - 80;
      context.drawImage(
        assets.cloud,
        x,
        state.height * y,
        assets.cloud.naturalWidth * cloudScale,
        assets.cloud.naturalHeight * cloudScale,
      );
    }
  }
  context.filter = "none";
}

function drawGround(
  context: CanvasRenderingContext2D,
  state: RenderState,
  assets: GameAssets,
): void {
  setNightFilter(context, state.night);
  const main = assets.ground[0];
  const scale = state.sceneScale;
  const tileWidth = main.naturalWidth * scale;
  let x = -(state.travel % tileWidth);
  while (x < state.width) {
    context.drawImage(
      main,
      x,
      state.groundY,
      tileWidth,
      main.naturalHeight * scale,
    );
    x += tileWidth;
  }

  const decor = assets.ground[Math.floor(state.travel / 80) % 2 === 0 ? 1 : 2];
  const decorWidth = decor.naturalWidth * scale;
  x = -((state.travel * 0.82) % decorWidth);
  while (x < state.width) {
    context.drawImage(
      decor,
      x,
      state.groundY + 8 * scale,
      decorWidth,
      decor.naturalHeight * scale,
    );
    x += decorWidth;
  }
  context.filter = "none";
}

function drawObstacle(
  context: CanvasRenderingContext2D,
  state: RenderState,
  assets: GameAssets,
  obstacle: ObstacleState,
): void {
  const image = obstacle.kind === "cactus"
    ? assets.cactus[obstacle.variant]
    : assets.ptero[obstacle.frame];
  const scale = state.sceneScale * (obstacle.kind === "ptero" ? 0.55 : 1);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const baselineOffset = obstacle.kind === "cactus" ? 2 * scale : 0;
  setNightFilter(context, state.night);
  context.drawImage(
    image,
    obstacle.x,
    obstacle.bottom - height + baselineOffset,
    width,
    height,
  );
  context.filter = "none";
}

function drawDinosaur(
  context: CanvasRenderingContext2D,
  state: RenderState,
  assets: GameAssets,
): void {
  const dinosaur = state.dinosaur;
  const image = dinosaur.dead
    ? assets.dead
    : dinosaur.ducking
      ? assets.duck[dinosaur.frame % assets.duck.length]
      : assets.run[dinosaur.jumping ? 2 : dinosaur.frame % assets.run.length];
  const scale = state.sceneScale * 0.5;
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  // PNG 角色帧底部有透明留白，按可见像素底边贴到地面线。
  const baselineOffset = 8 * scale;
  setNightFilter(context, state.night);
  context.drawImage(
    image,
    dinosaur.x,
    dinosaur.footY - height + baselineOffset,
    width,
    height,
  );
  context.filter = "none";
}

function drawNumber(
  context: CanvasRenderingContext2D,
  assets: GameAssets,
  value: number,
  right: number,
  top: number,
  scale: number,
  night: boolean,
): number {
  const characters = Math.max(0, Math.floor(value)).toString().padStart(5, "0").slice(-5);
  const images = [...characters].map((character) => assets.digits[Number(character)]);
  const width = images.reduce(
    (total, image) => total + image.naturalWidth * scale + 3 * scale,
    -3 * scale,
  );
  let x = right - width;
  setNightFilter(context, night);
  for (const image of images) {
    context.drawImage(
      image,
      x,
      top,
      image.naturalWidth * scale,
      image.naturalHeight * scale,
    );
    x += image.naturalWidth * scale + 3 * scale;
  }
  context.filter = "none";
  return width;
}

function drawScore(
  context: CanvasRenderingContext2D,
  state: RenderState,
  assets: GameAssets,
): void {
  const scale = Math.max(1.05, state.sceneScale * 1.35);
  const right = state.width - 22 * state.sceneScale;
  const top = 18 * state.sceneScale;
  const scoreWidth = drawNumber(context, assets, state.score, right, top, scale, state.night);
  const highWidth = drawNumber(
    context,
    assets,
    state.highScore,
    right - scoreWidth - 44 * state.sceneScale,
    top,
    scale,
    state.night,
  );
  const label = assets.high;
  setNightFilter(context, state.night);
  context.drawImage(
    label,
    right - scoreWidth - highWidth - 76 * state.sceneScale,
    top,
    label.naturalWidth * scale,
    label.naturalHeight * scale,
  );
  context.filter = "none";
}

function drawGameOver(
  context: CanvasRenderingContext2D,
  state: RenderState,
  assets: GameAssets,
): void {
  if (state.status !== "game-over") return;
  const image = assets.gameOver;
  const scale = Math.max(0.9, Math.min(1.55, state.width / 700));
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  setNightFilter(context, state.night);
  context.drawImage(image, (state.width - width) / 2, state.height * 0.34, width, height);
  context.filter = "none";
}

export function renderGame(
  context: CanvasRenderingContext2D,
  state: RenderState,
  assets: GameAssets,
): void {
  context.imageSmoothingEnabled = false;
  drawBackground(context, state, assets);
  drawGround(context, state, assets);
  for (const obstacle of state.obstacles) drawObstacle(context, state, assets, obstacle);
  drawDinosaur(context, state, assets);
  drawScore(context, state, assets);
  drawGameOver(context, state, assets);

  if (state.flash > 0) {
    context.fillStyle = `rgba(255, 255, 255, ${state.flash * 0.5})`;
    context.fillRect(0, 0, state.width, state.height);
  }
}
