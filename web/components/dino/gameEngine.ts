export type RunnerStatus = "ready" | "running" | "paused" | "game-over";
export type RunnerEvent = "game-over" | "milestone";
export type ObstacleKind = "cactus" | "ptero";

export type ObstacleState = {
  kind: ObstacleKind;
  variant: number;
  x: number;
  bottom: number;
  frame: number;
  animationTime: number;
};

export type RenderState = {
  width: number;
  height: number;
  groundY: number;
  sceneScale: number;
  status: RunnerStatus;
  score: number;
  highScore: number;
  night: boolean;
  moonPhase: number;
  flash: number;
  travel: number;
  dinosaur: {
    x: number;
    footY: number;
    frame: number;
    jumping: boolean;
    ducking: boolean;
    dead: boolean;
  };
  obstacles: readonly ObstacleState[];
};

type HitBox = { x: number; y: number; width: number; height: number };

const CACTUS_SIZES = [
  [17, 32],
  [29, 32],
  [42, 32],
  [25, 44],
  [40, 44],
  [60, 44],
] as const;
const PTERO_SIZES = [[80, 55], [73, 48]] as const;

export class DinoGameEngine {
  private width = 1000;
  private height = 300;
  private groundY = 235;
  private sceneScale = 1;
  private baseSpeed = 380;
  private speed = 380;
  private spawnTimer = 0.9;
  private scoreValue = 0;
  private lastMilestone = 0;
  private moonPhase = 0;
  private flash = 0;
  private travel = 0;
  private animationTime = 0;
  private dinosaurFrame = 0;
  private dinosaurX = 78;
  private dinosaurFootY = 236;
  private velocityY = 0;
  private jumping = false;
  private ducking = false;
  private downPressed = false;
  private obstacles: ObstacleState[] = [];

  status: RunnerStatus = "ready";
  score = 0;
  highScore: number;
  night = false;

  constructor(highScore: number) {
    this.highScore = Math.max(0, highScore);
  }

  resize(width: number, height: number): void {
    const previousGround = this.groundY;
    this.width = Math.max(320, width);
    this.height = Math.max(180, height);
    this.sceneScale = Math.max(0.76, Math.min(1.25, this.height / 300));
    this.groundY = this.height - Math.max(48, this.height * 0.215);
    this.baseSpeed = this.width * 0.38;
    this.dinosaurX = Math.max(34, this.width * 0.078);
    this.dinosaurFootY += this.groundY - previousGround;
    if (!this.jumping) this.dinosaurFootY = this.groundY + 1;
  }

  jump(): boolean {
    if (this.status === "ready" || this.status === "game-over") this.restart();
    if (this.status !== "running" || this.jumping) return false;
    this.jumping = true;
    this.ducking = false;
    this.velocityY = -690 * this.sceneScale;
    return true;
  }

  restart(): void {
    this.status = "running";
    this.score = 0;
    this.scoreValue = 0;
    this.lastMilestone = 0;
    this.speed = this.baseSpeed;
    this.spawnTimer = 0.85;
    this.moonPhase = 0;
    this.flash = 0;
    this.travel = 0;
    this.animationTime = 0;
    this.dinosaurFrame = 0;
    this.dinosaurFootY = this.groundY + 1;
    this.velocityY = 0;
    this.jumping = false;
    this.ducking = false;
    this.night = false;
    this.obstacles = [];
  }

  togglePause(): void {
    if (this.status === "running") this.status = "paused";
    else if (this.status === "paused") this.status = "running";
  }

  pause(): void {
    if (this.status === "running") this.status = "paused";
  }

  setDuck(pressed: boolean): void {
    this.downPressed = pressed;
    this.ducking = pressed && !this.jumping && this.status === "running";
  }

  update(dt: number): RunnerEvent[] {
    if (this.status !== "running") return [];
    const events: RunnerEvent[] = [];
    this.updateDinosaur(dt);
    this.speed = Math.min(this.width * 0.76, this.baseSpeed * (1 + this.score * 0.0005));
    this.travel += this.speed * dt;
    this.scoreValue += 10 * dt * (this.speed / this.baseSpeed);
    const nextScore = Math.floor(this.scoreValue);

    if (nextScore !== this.score) {
      this.score = nextScore;
      const milestone = Math.floor(this.score / 100);
      if (milestone > this.lastMilestone) {
        this.lastMilestone = milestone;
        events.push("milestone");
      }
      const nextNight = Math.floor(this.score / 500) % 2 === 1;
      if (nextNight !== this.night) {
        this.night = nextNight;
        this.flash = 1;
        if (nextNight) this.moonPhase = (this.moonPhase + 1) % 7;
      }
    }

    this.flash = Math.max(0, this.flash - dt / 0.34);
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) this.spawnObstacle();

    for (const obstacle of this.obstacles) {
      obstacle.x -= this.speed * dt;
      if (obstacle.kind === "ptero") {
        obstacle.animationTime += dt;
        if (obstacle.animationTime >= 0.16) {
          obstacle.animationTime = 0;
          obstacle.frame = (obstacle.frame + 1) % 2;
        }
      }
    }
    this.obstacles = this.obstacles.filter((obstacle) => obstacle.x > -100);

    if (this.obstacles.some((obstacle) => this.collides(obstacle))) {
      this.status = "game-over";
      this.ducking = false;
      this.highScore = Math.max(this.highScore, this.score);
      events.push("game-over");
    }
    return events;
  }

  getRenderState(): RenderState {
    return {
      width: this.width,
      height: this.height,
      groundY: this.groundY,
      sceneScale: this.sceneScale,
      status: this.status,
      score: this.score,
      highScore: this.highScore,
      night: this.night,
      moonPhase: this.moonPhase,
      flash: this.flash,
      travel: this.travel,
      dinosaur: {
        x: this.dinosaurX,
        footY: this.dinosaurFootY,
        frame: this.dinosaurFrame,
        jumping: this.jumping,
        ducking: this.ducking,
        dead: this.status === "game-over",
      },
      obstacles: this.obstacles,
    };
  }

  private updateDinosaur(dt: number): void {
    if (this.jumping) {
      const fastFall = this.downPressed && this.velocityY > -100 ? 2300 : 0;
      this.velocityY += (1850 * this.sceneScale + fastFall * this.sceneScale) * dt;
      this.dinosaurFootY += this.velocityY * dt;
      if (this.dinosaurFootY >= this.groundY + 1) {
        this.dinosaurFootY = this.groundY + 1;
        this.velocityY = 0;
        this.jumping = false;
      }
    }
    this.ducking = this.downPressed && !this.jumping;
    this.animationTime += dt;
    const interval = this.ducking ? 0.11 : 0.085;
    if (!this.jumping && this.animationTime >= interval) {
      this.animationTime = 0;
      this.dinosaurFrame = (this.dinosaurFrame + 1) % (this.ducking ? 2 : 6);
    }
  }

  private spawnObstacle(): void {
    const usePtero = this.score >= 180 && Math.random() < 0.28;
    const kind: ObstacleKind = usePtero ? "ptero" : "cactus";
    const variant = usePtero ? 0 : Math.floor(Math.random() * CACTUS_SIZES.length);
    const pteroBottom = Math.random() < 0.5
      ? this.groundY - 18 * this.sceneScale
      : this.groundY - 55 * this.sceneScale;
    this.obstacles.push({
      kind,
      variant,
      x: this.width + 35 + Math.random() * this.width * 0.09,
      bottom: usePtero ? pteroBottom : this.groundY + 1,
      frame: 0,
      animationTime: 0,
    });
    const gap = this.width * (0.39 + Math.random() * 0.3);
    this.spawnTimer = gap / this.speed;
  }

  private collides(obstacle: ObstacleState): boolean {
    const dinosaur = this.dinosaurHitBox();
    const obstacleBox = this.obstacleHitBox(obstacle);
    return dinosaur.x < obstacleBox.x + obstacleBox.width
      && dinosaur.x + dinosaur.width > obstacleBox.x
      && dinosaur.y < obstacleBox.y + obstacleBox.height
      && dinosaur.y + dinosaur.height > obstacleBox.y;
  }

  private dinosaurHitBox(): HitBox {
    const width = (this.ducking ? 117 : 89) * 0.5 * this.sceneScale;
    const height = (this.ducking ? 69 : 96) * 0.5 * this.sceneScale;
    return {
      x: this.dinosaurX + width * 0.16,
      y: this.dinosaurFootY - height + height * 0.12,
      width: width * 0.7,
      height: height * 0.8,
    };
  }

  private obstacleHitBox(obstacle: ObstacleState): HitBox {
    const size = obstacle.kind === "cactus"
      ? CACTUS_SIZES[obstacle.variant]
      : PTERO_SIZES[obstacle.frame];
    const scale = this.sceneScale * (obstacle.kind === "ptero" ? 0.55 : 1);
    const width = size[0] * scale;
    const height = size[1] * scale;
    return {
      x: obstacle.x + width * 0.08,
      y: obstacle.bottom - height + height * 0.08,
      width: width * 0.84,
      height: height * 0.84,
    };
  }
}
