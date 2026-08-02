import { NextRequest, NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { text, characterColor } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const videosDir = path.join(process.cwd(), "public", "videos");
    fs.mkdirSync(videosDir, { recursive: true });

    const filename = `${randomUUID()}.mp4`;
    const outputPath = path.join(videosDir, filename);

    // Bundle the Remotion project (the same composition used by the CLI script)
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), "src", "index.ts"),
    });

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "CartoonScene",
      inputProps: { text, characterColor: characterColor || "#4F9DFF" },
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: { text, characterColor: characterColor || "#4F9DFF" },
    });

    return NextResponse.json({ url: `/videos/${filename}` });
  } catch (err: any) {
    console.error("Render failed:", err);
    return NextResponse.json(
      { error: err?.message || "Render failed on the server." },
      { status: 500 }
    );
  }
}
