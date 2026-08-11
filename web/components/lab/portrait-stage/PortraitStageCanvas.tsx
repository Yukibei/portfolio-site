"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { stageAssets } from "./stageConfig";

const IMAGE_ASPECT = 1448 / 1086;

export default function PortraitStageCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.dataset.revealMode = "hover-mask";

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
    camera.position.z = 1;

    const loader = new THREE.TextureLoader();
    let loadedTextures = 0;
    const markLoaded = () => {
      loadedTextures += 1;
      if (loadedTextures === 2) canvas.dataset.stageReady = "true";
    };

    const portrait = loader.load(stageAssets.portrait, markLoaded);
    const crt = loader.load(stageAssets.crt, markLoaded);
    [portrait, crt].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    });

    const mouse = {
      current: new THREE.Vector2(0.5, 0.55),
      target: new THREE.Vector2(0.5, 0.55),
      active: 0,
      targetActive: 0,
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uPortrait: { value: portrait },
        uCrt: { value: crt },
        uMouse: { value: mouse.current },
        uActive: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: `
        precision highp float;
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uPortrait;
        uniform sampler2D uCrt;
        uniform vec2 uMouse;
        uniform float uActive;
        uniform float uTime;
        varying vec2 vUv;

        float ellipseMask(vec2 uv, vec2 center, vec2 radius){
          vec2 q = (uv - center) / radius;
          float d = dot(q, q);
          return 1.0 - smoothstep(0.55, 1.0, d);
        }

        void main(){
          vec4 human = texture2D(uPortrait, vUv);
          vec2 crtUv = (vUv - vec2(0.5, 0.56)) * vec2(0.92, 0.92) + vec2(0.5, 0.56);
          vec4 machine = texture2D(uCrt, crtUv);

          float headLimit = ellipseMask(vUv, vec2(0.5, 0.62), vec2(0.38, 0.34));
          float reveal = ellipseMask(vUv, uMouse, vec2(0.27, 0.2)) * headLimit * uActive;
          float softGlow = ellipseMask(vUv, uMouse, vec2(0.33, 0.26)) * headLimit * uActive;
          float edge = smoothstep(0.05, 0.45, reveal) * (1.0 - smoothstep(0.45, 0.92, reveal));

          vec4 mixed = mix(human, machine, reveal * machine.a);
          vec3 orange = vec3(1.0, 0.37, 0.08);
          mixed.rgb += orange * edge * 0.32;
          mixed.rgb += vec3(0.95, 0.9, 1.0) * softGlow * machine.a * 0.18;
          mixed.rgb -= step(0.997, fract(vUv.y * 120.0)) * 0.035;

          if (mixed.a < 0.02) discard;
          gl_FragColor = mixed;
        }`,
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), material);
    scene.add(plane);

    const resize = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      const aspect = width / height;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();

      const viewW = 2 * aspect;
      const viewH = 2;
      const fill = width < 700 ? 1.18 : 1.04;
      let planeW: number;
      let planeH: number;
      if (viewW / viewH > IMAGE_ASPECT) {
        planeH = viewH * fill;
        planeW = planeH * IMAGE_ASPECT;
      } else {
        planeW = viewW * fill;
        planeH = planeW / IMAGE_ASPECT;
      }
      plane.scale.set(planeW, planeH, 1);
    };

    const setMouse = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      mouse.target.set(Math.min(Math.max(x, 0), 1), Math.min(Math.max(y, 0), 1));
      mouse.targetActive = 1;
    };

    const onMove = (event: MouseEvent) => setMouse(event.clientX, event.clientY);
    const onLeave = () => {
      mouse.targetActive = 0;
    };
    const onTouch = (event: TouchEvent) => {
      if (event.touches[0]) setMouse(event.touches[0].clientX, event.touches[0].clientY);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      mouse.current.lerp(mouse.target, 0.18);
      mouse.active += (mouse.targetActive - mouse.active) * 0.14;
      material.uniforms.uMouse.value.copy(mouse.current);
      material.uniforms.uActive.value = mouse.active;
      material.uniforms.uTime.value = now / 1000;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("mouseleave", onLeave);
      material.dispose();
      plane.geometry.dispose();
      portrait.dispose();
      crt.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Interactive AI portrait stage"
      className="absolute inset-0 h-full w-full"
    />
  );
}
