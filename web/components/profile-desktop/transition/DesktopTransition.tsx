"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setSiteNavImmersive } from "../../site/immersiveNavigation";
import DesktopPortfolio from "../DesktopPortfolio";
import LaptopModel from "./LaptopModel";
import SideMascots from "./SideMascots";

type SceneMetrics = {
  openScale: number;
  screenOffsetY: number;
  screenScaleX: number;
  screenScaleY: number;
};

const DEFAULT_METRICS: SceneMetrics = {
  openScale: 2.8,
  screenOffsetY: -104,
  screenScaleX: 0.22,
  screenScaleY: 0.22,
};

function measureScene(): SceneMetrics {
  const availableScale = Math.min(
    window.innerWidth * 0.78 / 150,
    window.innerHeight * 0.56 / 190,
  );
  const openScale = Math.min(4.8, Math.max(1.85, availableScale));

  return {
    openScale,
    screenOffsetY: -37 * openScale,
    screenScaleX: 130 * openScale / window.innerWidth,
    screenScaleY: 74 * openScale / window.innerHeight,
  };
}

export default function DesktopTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const desktopInteractiveRef = useRef(false);
  const navImmersiveRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const sceneReady = useInView(sectionRef, { once: true, amount: "some" });
  const [desktopInteractive, setDesktopInteractive] = useState(false);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const updateMetrics = () => setMetrics(measureScene());
    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  const closedScale = metrics.openScale * 0.4;
  const sceneScale = useTransform(
    scrollYProgress,
    [0, 0.12, 0.16, 0.22, 0.36, 0.44, 0.84, 0.92, 0.96, 1],
    [closedScale, closedScale, closedScale * 1.08, metrics.openScale * 0.72, metrics.openScale, metrics.openScale, metrics.openScale, metrics.openScale, metrics.openScale * 0.68, closedScale],
  );
  const laptopOpacity = useTransform(
    scrollYProgress,
    [0, 0.44, 0.5, 0.79, 0.84, 1],
    [1, 1, 0, 0, 1, 1],
  );
  const openingMascotOpacity = useTransform(
    scrollYProgress,
    [0, 0.01, 0.035, 0.4, 0.44, 0.48, 1],
    [0, 0, 1, 1, 0, 0, 0],
  );
  const closingMascotOpacity = useTransform(
    scrollYProgress,
    [0, 0.78, 0.82, 1],
    [0, 0, 1, 1],
  );

  const innerRotateX = useTransform(
    scrollYProgress,
    [0, 0.16, 0.22, 0.34, 0.36, 0.41, 0.43, 0.44, 0.92, 0.94, 0.96, 0.975, 0.988, 1],
    [30, 30, -60, -20, -20, -20, -20, -20, -20, -20, -20, -20, -60, 30],
  );
  const innerRotateY = useTransform(
    scrollYProgress,
    [0, 0.16, 0.22, 0.34, 0.36, 0.41, 0.43, 0.44, 0.92, 0.94, 0.96, 0.975, 0.988, 1],
    [200, 200, 150, 130, 120, 375, 357, 360, 360, 357, 375, 120, 150, 200],
  );
  const innerRotateZ = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const lidRotation = useTransform(
    scrollYProgress,
    [0, 0.16, 0.22, 0.26, 0.31, 0.38, 0.92, 0.94, 0.96, 0.975, 0.988, 1],
    [-90, -90, 15, -5, 5, 0, 0, 0, 5, -5, 15, -90],
  );
  const lidBackgroundPosition = useTransform(
    scrollYProgress,
    [0, 0.16, 0.22, 0.26, 0.92, 0.96, 0.988, 1],
    ["-100% 0%", "-100% 0%", "0% 100%", "100% 0%", "100% 0%", "100% 0%", "0% 100%", "-100% 0%"],
  );
  const screenShadePosition = useTransform(
    scrollYProgress,
    [0, 0.16, 0.3, 0.41, 0.43, 0.92, 0.94, 0.96, 0.98, 1],
    ["200px 0px", "200px 0px", "-200px 0px", "0px 0px", "-20px 0px", "-20px 0px", "-30px 0px", "0px 0px", "-200px 0px", "200px 0px"],
  );

  const screenOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.26, 0.86, 0.92, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const screenScaleY = useTransform(
    scrollYProgress,
    [0, 0.86, 0.885, 0.905, 0.92, 1],
    [1, 1, 0.58, 0.02, 0.004, 0.004],
  );
  const screenFilter = useTransform(
    scrollYProgress,
    [0, 0.26, 0.86, 0.9, 0.92, 1],
    ["brightness(.35)", "brightness(1)", "brightness(1)", "brightness(3.5)", "brightness(7)", "brightness(7)"],
  );
  const screenLineOpacity = useTransform(
    scrollYProgress,
    [0, 0.875, 0.895, 0.915, 0.93, 1],
    [0, 0, 1, 1, 0, 0],
  );

  const shadowRotateX = useTransform(
    scrollYProgress,
    [0, 0.16, 0.22, 0.34, 0.92, 0.96, 0.988, 1],
    [30, 30, 80, 80, 80, 80, 80, 30],
  );
  const shadowRotateY = useTransform(
    scrollYProgress,
    [0, 0.16, 0.22, 0.34, 0.92, 0.96, 0.988, 1],
    [-20, -20, -20, 0, 0, 0, -20, -20],
  );
  const shadowRotateZ = useTransform(
    scrollYProgress,
    [0, 0.16, 0.22, 0.34, 0.92, 0.96, 0.988, 1],
    [-20, -20, 50, -50, -50, -50, 50, -20],
  );
  const shadowX = useTransform(
    scrollYProgress,
    [0, 0.22, 0.34, 0.96, 0.988, 1],
    [0, 0, 30, 30, 0, 0],
  );
  const shadowOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const shadowBoxShadow = useTransform(
    scrollYProgress,
    [0, 0.16, 0.22, 0.34, 0.92, 0.96, 0.988, 1],
    [
      "0px 0px 50px 30px rgba(0,0,0,0.3)",
      "0px 0px 50px 30px rgba(0,0,0,0.3)",
      "0px 0px 35px 15px rgba(0,0,0,0.1)",
      "0px 0px 60px 40px rgba(0,0,0,0.3)",
      "0px 0px 60px 40px rgba(0,0,0,0.3)",
      "0px 0px 60px 40px rgba(0,0,0,0.3)",
      "0px 0px 35px 15px rgba(0,0,0,0.1)",
      "0px 0px 50px 30px rgba(0,0,0,0.3)",
    ],
  );

  const desktopOpacity = useTransform(
    scrollYProgress,
    [0, 0.435, 0.445, 0.8, 0.84, 0.855, 1],
    [0, 0, 1, 1, 1, 0, 0],
  );
  const desktopScaleX = useTransform(
    scrollYProgress,
    [0, 0.44, 0.52, 0.78, 0.84, 1],
    [metrics.screenScaleX, metrics.screenScaleX, 1, 1, metrics.screenScaleX, metrics.screenScaleX],
  );
  const desktopScaleY = useTransform(
    scrollYProgress,
    [0, 0.44, 0.52, 0.78, 0.84, 1],
    [metrics.screenScaleY, metrics.screenScaleY, 1, 1, metrics.screenScaleY, metrics.screenScaleY],
  );
  const desktopY = useTransform(
    scrollYProgress,
    [0, 0.44, 0.52, 0.78, 0.84, 1],
    [metrics.screenOffsetY, metrics.screenOffsetY, 0, 0, metrics.screenOffsetY, metrics.screenOffsetY],
  );
  const desktopRadius = useTransform(scrollYProgress, [0.44, 0.52, 0.78, 0.84], [2, 0, 0, 2]);
  const ambientOpacity = useTransform(
    scrollYProgress,
    [0, 0.44, 0.52, 0.78, 0.84, 1],
    [1, 1, 0.12, 0.12, 1, 1],
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const interactive = progress >= 0.52 && progress < 0.78;
    const immersive = progress >= 0.5 && progress < 0.855;

    if (desktopInteractiveRef.current !== interactive) {
      desktopInteractiveRef.current = interactive;
      setDesktopInteractive(interactive);
    }
    if (navImmersiveRef.current !== immersive) {
      navImmersiveRef.current = immersive;
      setSiteNavImmersive(immersive);
    }
  });

  useEffect(() => () => setSiteNavImmersive(false), []);

  useEffect(() => {
    if (reduceMotion || !sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: [0, 0.16, 0.22, 0.44, 0.52, 0.78, 0.84, 0.92, 1],
        duration: { min: 0.18, max: 0.5 },
        delay: 0.1,
        ease: "power2.inOut",
      },
    });
    return () => trigger.kill();
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <section ref={sectionRef} className="min-h-screen bg-[#050505]">
        {sceneReady ? <DesktopPortfolio /> : null}
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label="进入个人桌面" style={{ position: "relative", height: "500vh", background: "#050505" }}>
      <div style={{ position: "sticky", top: 0, width: "100%", height: "100dvh", minHeight: 620, overflow: "hidden", background: "#050505" }}>
        <motion.div aria-hidden style={{ position: "absolute", inset: 0, opacity: ambientOpacity, background: "radial-gradient(ellipse at 50% 63%, rgba(210,218,232,.16) 0%, rgba(66,74,90,.08) 24%, transparent 52%), linear-gradient(180deg, #050505 0%, #08090b 100%)", pointerEvents: "none" }} />

        {sceneReady ? (
          <>
            <SideMascots
              closingOpacity={closingMascotOpacity}
              openingOpacity={openingMascotOpacity}
            />

        <motion.div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", opacity: laptopOpacity, scale: sceneScale, perspective: 1200, transformStyle: "preserve-3d", willChange: "transform, opacity" }}>
          <LaptopModel
            innerRotateX={innerRotateX}
            innerRotateY={innerRotateY}
            innerRotateZ={innerRotateZ}
            lidRotation={lidRotation}
            lidBackgroundPosition={lidBackgroundPosition}
            screenShadePosition={screenShadePosition}
            screenScaleY={screenScaleY}
            screenOpacity={screenOpacity}
            screenFilter={screenFilter}
            screenLineOpacity={screenLineOpacity}
            shadowRotateX={shadowRotateX}
            shadowRotateY={shadowRotateY}
            shadowRotateZ={shadowRotateZ}
            shadowX={shadowX}
            shadowOpacity={shadowOpacity}
            shadowBoxShadow={shadowBoxShadow}
          />
        </motion.div>

            <motion.div style={{ position: "absolute", inset: 0, zIndex: 5, overflow: "hidden", borderRadius: desktopRadius, opacity: desktopOpacity, y: desktopY, scaleX: desktopScaleX, scaleY: desktopScaleY, pointerEvents: desktopInteractive ? "auto" : "none", transformOrigin: "50% 50%", willChange: "transform, opacity" }}>
              <DesktopPortfolio />
            </motion.div>
          </>
        ) : null}
      </div>
    </section>
  );
}
