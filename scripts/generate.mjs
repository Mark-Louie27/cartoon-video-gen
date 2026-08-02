// Simple, friendly way to generate a video without remembering Remotion CLI flags.
//
// Usage:
//   npm run generate -- "Hello there, welcome!"
//   npm run generate -- "Hello there!" "#FF6B6B"
//   npm run generate -- "Hello there!" "#FF6B6B" my-video.mp4

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const [, , textArg, colorArg, outputArg] = process.argv;

  if (!textArg) {
    console.error("\n❌ Missing text.\n");
    console.error('Usage: npm run generate -- "Your line of dialogue here"');
    console.error(
      'Optional:  npm run generate -- "Your text" "#FF6B6B" my-video.mp4\n'
    );
    process.exit(1);
  }

  const text = textArg;
  const characterColor = colorArg || "#4F9DFF";
  const outputFile = outputArg || "scene.mp4";
  const outputPath = path.join(__dirname, "..", "out", outputFile);

  console.log("\n🎬 Generating your video...");
  console.log(`   Text:  "${text}"`);
  console.log(`   Color: ${characterColor}`);
  console.log(`   Output: out/${outputFile}\n`);

  console.log("Step 1/3 — Bundling project...");
  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, "..", "src", "index.ts"),
  });

  console.log("Step 2/3 — Preparing composition...");
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "CartoonScene",
    inputProps: { text, characterColor },
  });

  console.log("Step 3/3 — Rendering frames to MP4 (this can take a minute)...");
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: { text, characterColor },
    onProgress: ({ progress }) => {
      process.stdout.write(`\r   Rendering: ${Math.round(progress * 100)}%   `);
    },
  });

  console.log(`\n\n✅ Done! Your video is at: out/${outputFile}\n`);
}

main().catch((err) => {
  console.error("\n❌ Something went wrong:\n");
  console.error(err.message || err);
  process.exit(1);
});
