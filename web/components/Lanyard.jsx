/* eslint-disable react/no-unknown-property */
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import LanyardEnvironment from "./lanyard/LanyardEnvironment";
import { forwardCanvasMissPointer } from "./lanyard/pointerForwarding";
import { BLANK_PIXEL, CARD_GLB, LANYARD_PNG, createCardTextureAtlas } from "./lanyard/textureAtlas";

extend({ MeshLineGeometry, MeshLineMaterial });

/**
 * @typedef {Object} LanyardProps
 * @property {[number, number, number]} [position]
 * @property {[number, number, number]} [gravity]
 * @property {number} [fov]
 * @property {boolean} [transparent]
 * @property {string | null} [frontImage]
 * @property {string | null} [backImage]
 * @property {"cover" | "contain"} [imageFit]
 * @property {string | null} [lanyardImage]
 * @property {number} [lanyardWidth]
 * @property {number} [cardScale]
 * @property {number} [sceneOffsetX]
 * @property {boolean} [active]
 * @property {number} [replay]
 */

/** @param {LanyardProps} props */
export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  cardScale = 2.25,
  sceneOffsetX = 0,
  active = true,
  replay = 0,
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  // tab 进入后台时 RAF 被节流，恢复时物理一步跨过数秒会解算爆炸（NaN），
  // 隐藏期间直接暂停物理
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleVisibility = () => setPaused(document.hidden);
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="relative z-0 flex h-full w-full items-center justify-center">
      <Canvas
        className="lanyard-canvas"
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        // 离开本区时停掉渲染循环（不再吃 GPU），常驻挂载但不空转
        frameloop={active ? "always" : "never"}
        gl={{ alpha: transparent, preserveDrawingBuffer: true }}
        onPointerDownCapture={forwardCanvasMissPointer}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics
          paused={paused || !active}
          gravity={gravity}
          timeStep={isMobile ? 1 / 30 : 1 / 60}
        >
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
            cardScale={cardScale}
            sceneOffsetX={sceneOffsetX}
            replay={replay}
          />
        </Physics>
        <LanyardEnvironment />
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  cardScale = 2.25,
  sceneOffsetX = 0,
  replay = 0,
}) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };
  const { nodes, materials } = useGLTF(CARD_GLB);
  const texture = useTexture(lanyardImage || LANYARD_PNG);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Composite the front/back images into the card's texture atlas.
  // 模型自带 atlas 分辨率低，直接按原尺寸合成会把自定义贴图压糊；
  // 放大合成画布（atlas 宽度提升到 ~4096）保住源图清晰度。
  const cardMap = useMemo(() => {
    return createCardTextureAtlas({
      baseMap: materials.base.map,
      frontImage,
      backImage,
      frontTex,
      backTex,
      imageFit,
    });
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const cardYOffset = 1.5 - cardScale * 1.229;
  const ropeLength = 0.76;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useEffect(() => {
    document.documentElement.dataset.lanyardCardActive =
      hovered || dragged ? "true" : "false";
    document.documentElement.dataset.lanyardCardDragging = dragged ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.lanyardCardActive;
      delete document.documentElement.dataset.lanyardCardDragging;
    };
  }, [hovered, dragged]);

  // 重新进入本区时（replay 自增）把绳结与卡片重置回顶部初始位姿、清零速度，
  // 让物理重新把它「掉」下来——复用同一画布与物理世界，不重建，故无首帧卡顿。
  useEffect(() => {
    if (replay === 0) return;
    const targets = [
      [fixed, sceneOffsetX],
      [j1, sceneOffsetX + 0.5],
      [j2, sceneOffsetX + 1],
      [j3, sceneOffsetX + 1.5],
      [card, sceneOffsetX + 2],
    ];
    targets.forEach(([ref, x]) => {
      const b = ref.current;
      if (!b) return;
      b.setTranslation?.({ x, y: 4, z: 0 }, true);
      b.setLinvel?.({ x: 0, y: 0, z: 0 }, true);
      b.setAngvel?.({ x: 0, y: 0, z: 0 }, true);
      b.setRotation?.({ x: 0, y: 0, z: 0, w: 1 }, true);
      b.wakeUp?.();
    });
    // 清掉平滑缓存，避免绳子从旧位置拉一条瞬时直线
    if (j1.current) j1.current.lerped = null;
    if (j2.current) j2.current.lerped = null;
  }, [replay, sceneOffsetX]);

  useFrame((state, rawDelta) => {
    // 钳制帧间隔：节流恢复后的大 delta 会让 lerp 跳变
    const delta = Math.min(rawDelta, 1 / 30);
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      const valid = curve.points.every(
        (p) => Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z)
      );
      if (valid) {
        band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      }
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[sceneOffsetX, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.36 * cardScale, 0.5 * cardScale, 0.01]} position={[0, cardYOffset + cardScale * 0.523, 0]} />
          <group
            scale={cardScale}
            position={[0, cardYOffset, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (
              e.target.releasePointerCapture(e.pointerId), drag(false)
            )}
            onPointerDown={(e) => (
              e.target.setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              )
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} frustumCulled={false}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={true}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap={lanyardImage ? 1 : 0}
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(CARD_GLB);
