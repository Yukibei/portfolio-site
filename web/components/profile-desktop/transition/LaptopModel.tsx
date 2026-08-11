"use client";

import { useId } from "react";
import { motion, type MotionValue } from "framer-motion";
import DesktopPreview from "./DesktopPreview";
import styles from "./LaptopModel.module.css";

type LaptopModelProps = {
  innerRotateX: MotionValue<number>;
  innerRotateY: MotionValue<number>;
  innerRotateZ: MotionValue<number>;
  lidRotation: MotionValue<number>;
  lidBackgroundPosition: MotionValue<string>;
  screenShadePosition: MotionValue<string>;
  screenScaleY: MotionValue<number>;
  screenOpacity: MotionValue<number>;
  screenFilter: MotionValue<string>;
  screenLineOpacity: MotionValue<number>;
  shadowRotateX: MotionValue<number>;
  shadowRotateY: MotionValue<number>;
  shadowRotateZ: MotionValue<number>;
  shadowX: MotionValue<number>;
  shadowOpacity: MotionValue<number>;
  shadowBoxShadow: MotionValue<string>;
};

const KEYS = Array.from({ length: 72 }, (_, index) => index);

function AppleLogo() {
  const gradientId = useId().replaceAll(":", "");

  return (
    <svg className={styles.logo} viewBox="0 0 170 170" aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="10%" stopColor="#626262" />
          <stop offset="100%" stopColor="#aaa" />
        </linearGradient>
      </defs>
      <path
        d="m150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-.9 2.61-1.85 5.11-2.86 7.51zm-31.26-123.01c0 8.1021-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-.119-.972-.188-1.995-.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.3113 11.45-8.597 4.62-2.2516 8.99-3.4968 13.1-3.71.12 1.0831.17 2.1663.17 3.2409z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

export default function LaptopModel({
  innerRotateX,
  innerRotateY,
  innerRotateZ,
  lidRotation,
  lidBackgroundPosition,
  screenShadePosition,
  screenScaleY,
  screenOpacity,
  screenFilter,
  screenLineOpacity,
  shadowRotateX,
  shadowRotateY,
  shadowRotateZ,
  shadowX,
  shadowOpacity,
  shadowBoxShadow,
}: LaptopModelProps) {
  return (
    <div className={styles.macbook}>
      <motion.div className={styles.inner} style={{ rotateX: innerRotateX, rotateY: innerRotateY, rotateZ: innerRotateZ }}>
        <motion.div className={styles.screen} style={{ rotateX: lidRotation, backgroundPosition: lidBackgroundPosition }}>
          <AppleLogo />
          <div className={styles.screenFace}>
            <div className={styles.camera} />
            <div className={styles.display}>
              <motion.div className={styles.screenContent} style={{ scaleY: screenScaleY, opacity: screenOpacity, filter: screenFilter }}><DesktopPreview /></motion.div>
              <motion.div className={styles.shade} style={{ backgroundPosition: screenShadePosition }} />
              <motion.div className={styles.screenLine} style={{ opacity: screenLineOpacity }} />
            </div>
            <span className={styles.brand}>MacBook Air</span>
          </div>
        </motion.div>

        <div className={styles.macbody}>
          <div className={styles.macbodyFace}>
            <div className={styles.touchpad} />
            <div className={styles.keyboard}>
              {KEYS.map((key) => <span key={key} className={`${styles.key} ${key === 5 ? styles.space : ""} ${key >= 56 ? styles.functionKey : ""}`} />)}
            </div>
          </div>
          <span className={`${styles.pad} ${styles.padOne}`} />
          <span className={`${styles.pad} ${styles.padTwo}`} />
          <span className={`${styles.pad} ${styles.padThree}`} />
          <span className={`${styles.pad} ${styles.padFour}`} />
        </div>
      </motion.div>

      <motion.div
        className={styles.shadow}
        style={{
          rotateX: shadowRotateX,
          rotateY: shadowRotateY,
          rotateZ: shadowRotateZ,
          x: shadowX,
          opacity: shadowOpacity,
          boxShadow: shadowBoxShadow,
        }}
      />
    </div>
  );
}
