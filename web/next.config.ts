import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // @react-three/rapier 的 joint 在 StrictMode 双挂载下会被重复创建，
  // 物理解算产生 NaN（绳带几何报 position NaN、画面空白），故关闭。
  reactStrictMode: false,
  async headers() {
    const cacheControl =
      "public, max-age=604800, stale-while-revalidate=86400";
    const assetDirectories = [
      "dino",
      "experience",
      "glass",
      "hero",
      "journey",
      "lab",
      "lanyard",
      "profile-desktop",
      "projects",
      "work",
    ];
    const mediaSources = [
      ...assetDirectories.map((directory) => `/${directory}/:asset*`),
      "/hero-video.mp4",
      "/hero-poster.jpg",
    ];

    return mediaSources.map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: cacheControl }],
    }));
  },
};

export default nextConfig;
