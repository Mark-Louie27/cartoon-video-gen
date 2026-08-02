import { Composition } from "remotion";
import { CartoonScene } from "./CartoonScene";

const FPS = 30;
const MIN_SECONDS = 3;
const MAX_SECONDS = 10;
const WORDS_PER_SECOND = 2.5; // rough average speaking pace

// Estimate how long the line takes to read/speak, clamped to [MIN, MAX]
const estimateDurationInFrames = (text: string): number => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const rawSeconds = wordCount / WORDS_PER_SECOND;
  const clampedSeconds = Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, rawSeconds));
  return Math.round(clampedSeconds * FPS);
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CartoonScene"
      component={CartoonScene}
      fps={FPS}
      width={1280}
      height={720}
      // Fallback duration used by Remotion Studio before props are known
      durationInFrames={estimateDurationInFrames(
        "Hello! Welcome to my explainer video."
      )}
      defaultProps={{
        text: "Hello! Welcome to my explainer video.",
        characterColor: "#4F9DFF",
      }}
      // Recomputes duration per-render based on the actual text passed in
      calculateMetadata={async ({ props }) => {
        return {
          durationInFrames: estimateDurationInFrames(props.text),
        };
      }}
    />
  );
};
