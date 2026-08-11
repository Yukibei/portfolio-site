"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { loadGameAssets, playGameSound, type GameAssets, type GameSound } from "./gameAssets";
import { DinoGameEngine, type RunnerStatus } from "./gameEngine";
import { renderGame } from "./gameRenderer";

type GameSnapshot = {
  status: RunnerStatus;
  score: number;
  highScore: number;
  airborne: boolean;
  ducking: boolean;
};

type DinoRunnerGameProps = {
  compact?: boolean;
  className?: string;
};

const STORAGE_KEY = "yiling-dino-high-score";
const INITIAL_SNAPSHOT: GameSnapshot = {
  status: "ready",
  score: 0,
  highScore: 0,
  airborne: false,
  ducking: false,
};

function readHighScore(): number {
  const value = Number.parseInt(window.localStorage.getItem(STORAGE_KEY) ?? "0", 10);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function snapshotOf(engine: DinoGameEngine): GameSnapshot {
  const state = engine.getRenderState();
  return {
    status: state.status,
    score: state.score,
    highScore: state.highScore,
    airborne: state.dinosaur.jumping,
    ducking: state.dinosaur.ducking,
  };
}

export default function DinoRunnerGame({
  compact = false,
  className = "",
}: DinoRunnerGameProps) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DinoGameEngine | null>(null);
  const assetsRef = useRef<GameAssets | null>(null);
  const mutedRef = useRef(true);
  const playRef = useRef<(sound: GameSound) => void>(() => undefined);
  const [snapshot, setSnapshot] = useState(INITIAL_SNAPSHOT);
  const [assetsReady, setAssetsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  const publish = useCallback(() => {
    const engine = engineRef.current;
    if (engine) setSnapshot(snapshotOf(engine));
  }, []);

  const jump = useCallback(() => {
    const engine = engineRef.current;
    if (engine?.jump()) {
      playRef.current("jump");
      publish();
    }
    canvasRef.current?.focus({ preventScroll: true });
  }, [publish]);

  const restart = useCallback(() => {
    engineRef.current?.restart();
    publish();
    canvasRef.current?.focus({ preventScroll: true });
  }, [publish]);

  const togglePause = useCallback(() => {
    engineRef.current?.togglePause();
    publish();
  }, [publish]);

  const setDuck = useCallback((pressed: boolean) => {
    engineRef.current?.setDuck(pressed);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const engine = new DinoGameEngine(readHighScore());
    const context = canvas.getContext("2d");
    if (!context) {
      setLoadError("当前浏览器无法创建 Canvas 游戏画面。");
      return;
    }
    engineRef.current = engine;
    setSnapshot(snapshotOf(engine));

    let cancelled = false;
    let animationFrame = 0;
    let lastTime = performance.now();
    let lastPublish = 0;
    let viewport = { width: 1000, height: 300, ratio: 1 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(320, rect.width);
      const height = Math.max(180, rect.height);
      viewport = { width, height, ratio };
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      engine.resize(width, height);
    };

    const play = (sound: GameSound) => {
      const assets = assetsRef.current;
      if (!mutedRef.current && assets) playGameSound(assets, sound);
    };
    playRef.current = play;

    const frame = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const assets = assetsRef.current;
      if (assets) {
        const events = engine.update(dt);
        for (const event of events) {
          if (event === "game-over") {
            window.localStorage.setItem(STORAGE_KEY, String(engine.highScore));
            play("die");
          } else {
            play("milestone");
          }
        }
        context.setTransform(viewport.ratio, 0, 0, viewport.ratio, 0, 0);
        renderGame(context, engine.getRenderState(), assets);
      }
      if (time - lastPublish > 100) {
        setSnapshot(snapshotOf(engine));
        lastPublish = time;
      }
      animationFrame = requestAnimationFrame(frame);
    };

    const isGameVisible = () => {
      const rect = container.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isGameVisible()) return;
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      if (["Space", "ArrowUp", "KeyW"].includes(event.code)) {
        event.preventDefault();
        if (!event.repeat && engine.jump()) play("jump");
      } else if (["ArrowDown", "KeyS"].includes(event.code)) {
        event.preventDefault();
        engine.setDuck(true);
      } else if (event.code === "KeyP" && !event.repeat) {
        engine.togglePause();
      } else if (event.code === "KeyR" && !event.repeat) {
        engine.restart();
      }
      setSnapshot(snapshotOf(engine));
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (["ArrowDown", "KeyS"].includes(event.code)) engine.setDuck(false);
    };
    const onVisibility = () => {
      if (document.hidden) {
        engine.pause();
        setSnapshot(snapshotOf(engine));
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onVisibility);
    document.addEventListener("visibilitychange", onVisibility);

    void loadGameAssets()
      .then((assets) => {
        if (cancelled) return;
        assetsRef.current = assets;
        setAssetsReady(true);
        animationFrame = requestAnimationFrame(frame);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "游戏素材加载失败。");
        }
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onVisibility);
      document.removeEventListener("visibilitychange", onVisibility);
      engineRef.current = null;
      assetsRef.current = null;
    };
  }, []);

  const primaryLabel = snapshot.status === "paused"
    ? "Resume"
    : snapshot.status === "game-over"
      ? "Run again"
      : "Start run";
  const primaryAction = snapshot.status === "paused" ? togglePause : jump;

  return (
    <section
      ref={containerRef}
      className={`w-full ${className}`}
      data-dino-game
      data-game-status={snapshot.status}
      data-game-score={snapshot.score}
      data-game-high-score={snapshot.highScore}
      data-dino-airborne={snapshot.airborne}
      data-dino-ducking={snapshot.ducking}
    >
      <div className="liquid-glass rounded-lg p-2 sm:p-3">
        <div className={`relative overflow-hidden rounded-md bg-[#f4f4ef] ${
          compact ? "h-[clamp(12rem,25vw,18rem)]" : "h-[clamp(14rem,29vw,22rem)]"
        }`}>
          <canvas
            ref={canvasRef}
            data-game-ready={assetsReady}
            tabIndex={0}
            aria-label="可操作的小恐龙跑酷游戏"
            onPointerDown={(event) => {
              event.preventDefault();
              jump();
            }}
            className="block h-full w-full touch-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-300"
          />

          {(!assetsReady || snapshot.status !== "running") && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/5">
              {loadError ? (
                <p className="max-w-sm px-6 text-center font-body text-sm text-red-900">{loadError}</p>
              ) : (
                <button
                  type="button"
                  disabled={!assetsReady}
                  onClick={primaryAction}
                  className="pointer-events-auto inline-flex min-h-14 min-w-[9.5rem] items-center justify-center gap-2 rounded-md border border-black/15 bg-black px-6 py-4 font-body text-sm font-medium text-white transition-colors hover:bg-black/80 disabled:cursor-wait disabled:opacity-45"
                >
                  {snapshot.status === "paused" ? <Play className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                  {assetsReady ? primaryLabel : "Loading"}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 px-1 pt-3">
          <div className="flex gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/48">
            <span className="tabular-nums">Score {snapshot.score.toString().padStart(5, "0")}</span>
            <span className="tabular-nums">Best {snapshot.highScore.toString().padStart(5, "0")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={jump} aria-label="跳跃" title="跳跃" className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 font-body text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              <ArrowUp className="h-4 w-4" /> Jump
            </button>
            <button type="button" onPointerDown={() => setDuck(true)} onPointerUp={() => setDuck(false)} onPointerCancel={() => setDuck(false)} onPointerLeave={() => setDuck(false)} aria-label="下蹲" title="按住下蹲" className="inline-flex h-9 touch-none items-center gap-1.5 rounded-md px-3 font-body text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              <ArrowDown className="h-4 w-4" /> Duck
            </button>
            <button type="button" onClick={togglePause} aria-label={snapshot.status === "paused" ? "继续" : "暂停"} title={snapshot.status === "paused" ? "继续" : "暂停"} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/58 transition-colors hover:bg-white/10 hover:text-white">
              {snapshot.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button type="button" onClick={restart} aria-label="重新开始" title="重新开始" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/58 transition-colors hover:bg-white/10 hover:text-white">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setMuted((current) => { const next = !current; mutedRef.current = next; return next; })} aria-label={muted ? "开启游戏音效" : "关闭游戏音效"} title={muted ? "开启游戏音效" : "关闭游戏音效"} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/58 transition-colors hover:bg-white/10 hover:text-white">
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
