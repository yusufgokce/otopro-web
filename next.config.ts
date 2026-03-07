import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a standalone build for Docker — copies only the files needed
  // to run the app, no node_modules bloat in the final image.
  output: "standalone",
};

export default nextConfig;
