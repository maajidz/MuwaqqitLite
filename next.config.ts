import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.lottie$/,
      type: 'json',
      parser: {
        parse: JSON.parse
      }
    });
    return config;
  }
};

export default nextConfig;