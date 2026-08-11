export type GameSound = "jump" | "die" | "milestone";

export type GameAssets = {
  run: readonly HTMLImageElement[];
  duck: readonly HTMLImageElement[];
  dead: HTMLImageElement;
  cactus: readonly HTMLImageElement[];
  ptero: readonly HTMLImageElement[];
  cloud: HTMLImageElement;
  ground: readonly HTMLImageElement[];
  moons: readonly HTMLImageElement[];
  stars: readonly HTMLImageElement[];
  gameOver: HTMLImageElement;
  high: HTMLImageElement;
  digits: readonly HTMLImageElement[];
  sounds: Readonly<Record<GameSound, HTMLAudioElement>>;
};

const ROOT = "/dino";
const DIGIT_PATHS = Array.from(
  { length: 10 },
  (_, index) => `${ROOT}/images/ui/digit_${index}.png`,
);

function imagePaths(folder: string, stem: string, count: number): string[] {
  return Array.from(
    { length: count },
    (_, index) => `${ROOT}/images/${folder}/${stem}_${index + 1}.png`,
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`无法加载游戏素材：${src}`));
    image.src = src;
  });
}

async function loadImages(paths: readonly string[]): Promise<HTMLImageElement[]> {
  return Promise.all(paths.map(loadImage));
}

function createSound(name: GameSound, volume: number): HTMLAudioElement {
  const audio = new Audio(`${ROOT}/audio/${name}.mp3`);
  audio.preload = "auto";
  audio.volume = volume;
  return audio;
}

export async function loadGameAssets(): Promise<GameAssets> {
  const [run, duck, dead, cactus, ptero, cloud, ground, moons, stars, gameOver, high, digits] =
    await Promise.all([
      loadImages(imagePaths("dinosaur", "run", 6)),
      loadImages(imagePaths("dinosaur", "duck", 2)),
      loadImage(`${ROOT}/images/dinosaur/dead.png`),
      loadImages(imagePaths("obstacles", "cactus", 6)),
      loadImages(imagePaths("obstacles", "ptero", 2)),
      loadImage(`${ROOT}/images/background/cloud.png`),
      loadImages(imagePaths("background", "ground", 3)),
      loadImages(imagePaths("background", "moon", 7)),
      loadImages(imagePaths("background", "stars", 3)),
      loadImage(`${ROOT}/images/ui/game_over.png`),
      loadImage(`${ROOT}/images/ui/high.png`),
      loadImages(DIGIT_PATHS),
    ]);

  return {
    run,
    duck,
    dead,
    cactus,
    ptero,
    cloud,
    ground,
    moons,
    stars,
    gameOver,
    high,
    digits,
    sounds: {
      jump: createSound("jump", 0.4),
      die: createSound("die", 0.5),
      milestone: createSound("milestone", 0.4),
    },
  };
}

export function playGameSound(assets: GameAssets, sound: GameSound): void {
  const audio = assets.sounds[sound];
  audio.currentTime = 0;
  void audio.play().catch(() => undefined);
}
