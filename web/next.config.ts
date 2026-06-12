import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-three/rapier 的 joint 在 StrictMode 双挂载下会被重复创建，
  // 物理解算产生 NaN（绳带几何报 position NaN、画面空白），故关闭。
  reactStrictMode: false,
};

export default nextConfig;
