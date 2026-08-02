/** @type {import('next').NextConfig} */
const nextConfig = {
  // These packages use native binaries (headless Chromium, video compositor)
  // that must run as-is in Node, not get bundled/webpacked by Next.js.
  serverExternalPackages: [
    "@remotion/renderer",
    "@remotion/bundler",
    "esbuild",
  ],
};

export default nextConfig;
