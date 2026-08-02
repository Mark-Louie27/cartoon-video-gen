# Cartoon Video Generator

Generate short, animated cartoon videos from a single line of text — through a web interface or the command line. Built with [Remotion](https://www.remotion.dev/) (React-based video rendering) and [Next.js](https://nextjs.org/).

## Features

- **Web UI** — text input, live color picker, one-click generate and download
- **Command-line interface** — scriptable video generation for automation or batch use
- **Automatic pacing** — video length scales with text length (3–10 seconds), so lines never feel rushed or padded
- **Live preview** — edit the animation itself with hot-reload, no rendering required
- **Server-side rendering** — every request renders a fresh MP4 on the server; no client-side processing

## Tech Stack

| Layer            | Technology                            |
| ---------------- | ------------------------------------- |
| Animation engine | Remotion (React → video)              |
| Web framework    | Next.js (App Router)                  |
| Rendering        | Server-side, via `@remotion/renderer` |
| Language         | TypeScript                            |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (LTS recommended)
- npm (bundled with Node.js)

## Installation

```bash
npm install
```

This installs all dependencies. On first render, Remotion additionally downloads a headless Chromium browser (~150MB, one-time, cached afterward) to render video frames.

## Usage

### Web application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Enter your text, choose a character color, click **Generate Video**, then **Download Video** once rendering completes.

For a production build:

```bash
npm run build
npm run start
```

### Command line

Generate a video directly, without opening a browser:

```bash
npm run generate -- "Your text goes here"
```

Output is saved to `out/scene.mp4`.

**With custom color and filename:**

```bash
npm run generate -- "Your text goes here" "#FF6B6B" my-video.mp4
```

| Argument       | Description                          | Default     |
| -------------- | ------------------------------------ | ----------- |
| 1st (required) | Text the character says              | —           |
| 2nd (optional) | Character color, as a hex code       | `#4F9DFF`   |
| 3rd (optional) | Output filename, saved inside `out/` | `scene.mp4` |

### Live preview / editing the animation

```bash
npm run preview
```

Opens Remotion Studio, an interactive editor. Changes to `src/CartoonScene.tsx` appear instantly without a full render — the fastest way to iterate on the visual design.

## Project Structure

├── app/
│ ├── page.tsx # Web UI (text input, generate/download buttons)
│ ├── layout.tsx # Root layout and global styling
│ └── api/generate/route.ts # Server route that renders video on request
├── src/
│ ├── CartoonScene.tsx # The animated composition (character, text, timing)
│ ├── Root.tsx # Registers the composition and its duration logic
│ └── index.ts # Remotion entry point
├── scripts/
│ └── generate.mjs # CLI rendering script
├── public/videos/ # Generated MP4s are saved here for the web app
└── remotion.config.ts # Remotion CLI configuration

## Configuration

- **Video duration** — controlled in `src/Root.tsx` (`estimateDurationInFrames`). Defaults: 3s minimum, 10s maximum, ~2.5 words/second pacing.
- **Resolution / frame rate** — set in the `<Composition>` props in `src/Root.tsx` (currently 1280×720 @ 30fps).
- **Visual design** — character, colors, and text styling live in `src/CartoonScene.tsx`.

## Production Notes

- The `/api/generate` route renders synchronously — the HTTP request stays open until the video finishes. This is fine for local use and light traffic; for production with concurrent users, consider moving rendering to a background job queue with polling or webhooks.
- Rendering requires headless Chromium and native compositor binaries. Serverless platforms with restricted runtimes (e.g. default Vercel functions) may not support this out of the box — a small persistent server, Docker container, or [Remotion Lambda](https://www.remotion.dev/lambda) is recommended for deployment.

## Troubleshooting

| Issue                                      | Solution                                                                                                                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `command not found: npm`                   | Install Node.js from [nodejs.org](https://nodejs.org) (LTS version), then retry.                                                                                                      |
| First generate takes a while               | Expected — Remotion is downloading headless Chromium (~150MB), one time only.                                                                                                         |
| `Host not in allowlist` / download blocked | Your network or firewall is blocking the download. Try a different network, or see [Remotion's manual setup docs](https://www.remotion.dev/docs/miscellaneous/chrome-headless-shell). |
| Video text looks cut off or overlapping    | The line is too long for the current layout/font size. Try a shorter line, or adjust text sizing in `src/CartoonScene.tsx`.                                                           |

## License

Not yet specified.
