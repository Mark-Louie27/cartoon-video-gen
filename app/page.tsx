"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [color, setColor] = useState("#4F9DFF");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Type something first.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt, characterColor: color }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate video.");
      }

      const data = await res.json();
      setVideoUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "60px auto",
        padding: "0 20px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Cartoon Video Generator</h1>
      <p style={{ color: "#666", marginBottom: 28 }}>
        Type a line, pick a color, generate a short animated video.
      </p>

      <label style={{ fontWeight: 600, fontSize: 14 }}>What should it say?</label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Hello! Welcome to my explainer video."
        rows={3}
        style={{
          width: "100%",
          marginTop: 8,
          padding: 12,
          fontSize: 16,
          borderRadius: 10,
          border: "1px solid #ccc",
          fontFamily: "inherit",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
        <label style={{ fontWeight: 600, fontSize: 14 }}>Character color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: 40, height: 32, border: "none", cursor: "pointer" }}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{
          marginTop: 20,
          width: "100%",
          padding: "14px 0",
          fontSize: 16,
          fontWeight: 700,
          color: "white",
          background: isGenerating ? "#9db8e8" : "#4F9DFF",
          border: "none",
          borderRadius: 10,
          cursor: isGenerating ? "not-allowed" : "pointer",
        }}
      >
        {isGenerating ? "Generating video..." : "Generate Video"}
      </button>

      {error && (
        <p style={{ color: "#c0392b", marginTop: 12, fontSize: 14 }}>{error}</p>
      )}

      {videoUrl && (
        <div style={{ marginTop: 28 }}>
          <video
            src={videoUrl}
            controls
            style={{ width: "100%", borderRadius: 10, background: "#000" }}
          />
          <a href={videoUrl} download style={{ textDecoration: "none" }}>
            <button
              style={{
                marginTop: 12,
                width: "100%",
                padding: "14px 0",
                fontSize: 16,
                fontWeight: 700,
                color: "#333",
                background: "#f1f1f1",
                border: "1px solid #ddd",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Download Video
            </button>
          </a>
        </div>
      )}
    </main>
  );
}
