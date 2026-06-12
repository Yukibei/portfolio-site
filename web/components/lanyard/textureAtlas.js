import * as THREE from "three";

export const CARD_GLB = "/lanyard/card.glb";
export const LANYARD_PNG = "/lanyard/lanyard.png";

export const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

function drawFittedImage(ctx, img, rect, canvasSize, imageFit) {
  const rx = rect.x * canvasSize.width;
  const ry = rect.y * canvasSize.height;
  const rw = rect.w * canvasSize.width;
  const rh = rect.h * canvasSize.height;
  const pickScale = imageFit === "contain" ? Math.min : Math.max;
  const scale = pickScale(rw / img.width, rh / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = rx + (rw - dw) / 2;
  const dy = ry + (rh - dh) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(rx, ry, rw, rh);
  ctx.clip();
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

export function createCardTextureAtlas({
  baseMap,
  frontImage,
  backImage,
  frontTex,
  backTex,
  imageFit,
}) {
  if (!frontImage && !backImage) return baseMap;

  const baseImg = baseMap.image;
  const scale = Math.max(1, Math.round(4096 / baseImg.width));
  const canvasSize = {
    width: baseImg.width * scale,
    height: baseImg.height * scale,
  };
  const canvas = document.createElement("canvas");
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return baseMap;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(baseImg, 0, 0, canvasSize.width, canvasSize.height);

  if (frontImage && frontTex.image) {
    drawFittedImage(ctx, frontTex.image, FRONT_UV_RECT, canvasSize, imageFit);
  }
  if (backImage && backTex.image) {
    drawFittedImage(ctx, backTex.image, BACK_UV_RECT, canvasSize, imageFit);
  }

  const composite = new THREE.CanvasTexture(canvas);
  composite.colorSpace = THREE.SRGBColorSpace;
  composite.flipY = baseMap.flipY;
  composite.anisotropy = 16;
  composite.needsUpdate = true;
  return composite;
}
