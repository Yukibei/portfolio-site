import Image from "next/image";
import { DESKTOP_BACKGROUND } from "./data";

const wallpaperStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  transform: "scale(1.015)",
} as const;

export default function DesktopWallpaper() {
  return (
    <Image
      src={DESKTOP_BACKGROUND}
      alt=""
      fill
      priority
      sizes="100vw"
      style={wallpaperStyle}
    />
  );
}
