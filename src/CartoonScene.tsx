import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

type Props = {
  text: string;
  characterColor: string;
};

export const CartoonScene: React.FC<Props> = ({ text, characterColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Character bounces in from below
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });
  const translateY = interpolate(entrance, [0, 1], [200, 0]);

  // Idle bob loop after entrance
  const bob = Math.sin(frame / 8) * 6;

  // Text fades + slides in slightly after character
  const textDelay = 15;
  const textProgress = spring({
    frame: frame - textDelay,
    fps,
    config: { damping: 15 },
  });
  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
  const textY = interpolate(textProgress, [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#FDF6EC" }}>
      {/* Simple cartoon character: circle head + rounded body */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          transform: `translate(-50%, ${translateY + bob}px)`,
        }}
      >
        <svg width="220" height="260" viewBox="0 0 220 260">
          {/* body */}
          <ellipse cx="110" cy="180" rx="70" ry="60" fill={characterColor} />
          {/* head */}
          <circle cx="110" cy="90" r="65" fill={characterColor} />
          {/* eyes */}
          <circle cx="88" cy="85" r="10" fill="white" />
          <circle cx="132" cy="85" r="10" fill="white" />
          <circle cx="88" cy="85" r="4" fill="#222" />
          <circle cx="132" cy="85" r="4" fill="#222" />
          {/* smile */}
          <path
            d="M 85 115 Q 110 135 135 115"
            stroke="#222"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* arms */}
          <ellipse cx="45" cy="170" rx="16" ry="40" fill={characterColor} />
          <ellipse cx="175" cy="170" rx="16" ry="40" fill={characterColor} />
        </svg>
      </div>

      {/* Speech text */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "white",
            padding: "20px 36px",
            borderRadius: 20,
            fontSize: 36,
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            color: "#222",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
