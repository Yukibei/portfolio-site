"use client";

import { motion, type MotionValue } from "framer-motion";
import styles from "./SideMascots.module.css";

type SideMascotsProps = {
  closingOpacity: MotionValue<number>;
  openingOpacity: MotionValue<number>;
};

export default function SideMascots({
  closingOpacity,
  openingOpacity,
}: SideMascotsProps) {
  return (
    <>
      <motion.aside
        aria-hidden="true"
        className={styles.stage}
        style={{ opacity: openingOpacity }}
      >
        <img
          alt=""
          className={`${styles.art} ${styles.openingLeftTop}`}
          draggable={false}
          src="/profile-desktop/mouse-muscle-transparent.png"
        />
        <img
          alt=""
          className={`${styles.art} ${styles.openingRightTop}`}
          draggable={false}
          src="/profile-desktop/mouse-delta-soldier-transparent.png"
        />
        <img
          alt=""
          className={`${styles.art} ${styles.openingLeftMiddle}`}
          draggable={false}
          src="/profile-desktop/mouse-coder-standalone.png"
        />
        <img
          alt=""
          className={`${styles.art} ${styles.openingLeftBottom}`}
          draggable={false}
          src="/profile-desktop/mouse-graduation-transparent.png"
        />
        <img
          alt=""
          className={`${styles.art} ${styles.openingRightMiddle}`}
          draggable={false}
          src="/profile-desktop/mouse-snack-standalone.png"
        />
        <img
          alt=""
          className={`${styles.art} ${styles.openingRightBottom}`}
          draggable={false}
          src="/profile-desktop/mouse-love-couple-transparent.png"
        />
      </motion.aside>

      <motion.aside
        aria-hidden="true"
        className={styles.stage}
        style={{ opacity: closingOpacity }}
      >
        <img
          alt=""
          className={`${styles.art} ${styles.closingLeftTop}`}
          draggable={false}
          src="/profile-desktop/mouse-offer-facing-left.png"
        />
        <img
          alt=""
          className={`${styles.art} ${styles.closingLeftMiddle}`}
          draggable={false}
          src="/profile-desktop/mouse-travel-fantasy.png"
        />
        <img
          alt=""
          className={`${styles.art} ${styles.closingLeftBottom}`}
          draggable={false}
          src="/profile-desktop/mouse-fantasy-facing-left.png"
        />
        <img
          alt=""
          className={`${styles.art} ${styles.closingRightMiddle}`}
          draggable={false}
          src="/profile-desktop/mouse-icpc-facing-right.png"
        />
        <img
          alt=""
          className={`${styles.art} ${styles.closingRightTop}`}
          draggable={false}
          src="/profile-desktop/mouse-delta-loot-transparent.png"
        />
        <img
          alt=""
          className={`${styles.art} ${styles.closingRightBottom}`}
          draggable={false}
          src="/profile-desktop/mouse-ai-programmer-facing-left.png"
        />
      </motion.aside>
    </>
  );
}
