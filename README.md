# Cartoon Video Generator

Turn a line of text into a short animated cartoon MP4 — via a web page, or the command line.

## First-time setup (only once)

```
npm install
```

## Web app (text box, Generate button, Download button)

```
npm run dev
```
Open http://localhost:3000 — type your line, hit **Generate Video**, then **Download Video** once it's ready. Rendering happens on the server; the page just shows a loading state and then the finished video.

## Command line (no browser needed)

```
npm run preview
```
Opens an interactive browser window. Edit `src/CartoonScene.tsx` and it updates instantly — no rendering needed while you're designing.

## Generate a video

```
npm run generate -- "Your text goes here"
```

Your MP4 will be saved to `out/scene.mp4`.

### Optional: custom character color and filename

```
npm run generate -- "Your text goes here" "#FF6B6B" my-video.mp4
```
- 2nd argument: hex color for the character (default `#4F9DFF`)
- 3rd argument: output filename (default `scene.mp4`), saved inside `out/`

Video length is automatic: shorter lines make a shorter video (min 3s), longer lines stretch up to a max of 10s.

## Troubleshooting

**"command not found: npm"** — install Node.js from https://nodejs.org (get the LTS version), then try again.

**First `npm run generate` takes a while / downloads something** — normal. Remotion downloads a headless Chromium browser once (~150MB) to render frames; it's cached after that.

**"Host not in allowlist" or download blocked** — your network/firewall is blocking the download. Try a different network, or download manually per Remotion's docs: https://www.remotion.dev/docs/miscellaneous/chrome-headless-shell

**Video looks cut off / text overlaps** — your text is too long for the animation's layout at the default font size; try a shorter line, or ask to adjust text size/wrapping in `CartoonScene.tsx`.
