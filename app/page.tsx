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
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoDot} />
          <h1 style={styles.title}>Cartoon Video Generator</h1>
        </div>
        <p style={styles.subtitle}>
          Type a line, pick a color, and generate a short animated video.
        </p>

        <label style={styles.label}>What should it say?</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Hello! Welcome to my explainer video."
          rows={3}
          style={styles.textarea}
        />
        <div style={styles.charCount}>{prompt.trim().length} characters</div>

        <div style={styles.colorRow}>
          <label style={styles.label}>Character color</label>
          <div style={styles.colorPickerWrap}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={styles.colorInput}
            />
            <span style={styles.colorHex}>{color.toUpperCase()}</span>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            ...styles.generateButton,
            ...(isGenerating ? styles.generateButtonDisabled : {}),
          }}
        >
          {isGenerating ? (
            <>
              <span style={styles.spinner} />
              Generating video...
            </>
          ) : (
            "Generate Video"
          )}
        </button>

        {error && <div style={styles.errorBox}>{error}</div>}

        {videoUrl && (
          <div style={styles.resultBlock}>
            <video src={videoUrl} controls style={styles.video} />
            <a href={videoUrl} download style={{ textDecoration: "none" }}>
              <button style={styles.downloadButton}>Download Video</button>
            </a>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #F5F7FB 0%, #EDF1F9 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "64px 20px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 560,
    background: "#FFFFFF",
    borderRadius: 20,
    padding: "36px 40px 40px",
    boxShadow: "0 8px 30px rgba(20, 30, 60, 0.08)",
    border: "1px solid #EAEDF3",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#4F9DFF",
    flexShrink: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    margin: "6px 0 28px",
  },
  label: {
    fontWeight: 600,
    fontSize: 13,
    color: "#374151",
    display: "block",
  },
  textarea: {
    width: "100%",
    marginTop: 8,
    padding: 14,
    fontSize: 15,
    lineHeight: 1.5,
    borderRadius: 12,
    border: "1px solid #D1D5DB",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
    color: "#111827",
    background: "#FFFFFF",
    outline: "none",
  },
  charCount: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: 4,
  },
  colorRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  colorPickerWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  colorInput: {
    width: 36,
    height: 36,
    padding: 0,
    border: "1px solid #D1D5DB",
    borderRadius: 8,
    cursor: "pointer",
    background: "none",
  },
  colorHex: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "monospace",
    minWidth: 64,
  },
  generateButton: {
    marginTop: 24,
    width: "100%",
    padding: "15px 0",
    fontSize: 15,
    fontWeight: 700,
    color: "#FFFFFF",
    background: "#4F9DFF",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    boxShadow: "0 2px 8px rgba(79, 157, 255, 0.35)",
    transition: "background 0.15s ease",
  },
  generateButtonDisabled: {
    background: "#A9C7F5",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.5)",
    borderTopColor: "#FFFFFF",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  errorBox: {
    marginTop: 14,
    padding: "10px 14px",
    background: "#FEF2F2",
    border: "1px solid #FCA5A5",
    color: "#B91C1C",
    borderRadius: 10,
    fontSize: 13.5,
  },
  resultBlock: {
    marginTop: 28,
    paddingTop: 24,
    borderTop: "1px solid #EEF0F4",
  },
  video: {
    width: "100%",
    borderRadius: 12,
    background: "#000",
    display: "block",
  },
  downloadButton: {
    marginTop: 14,
    width: "100%",
    padding: "14px 0",
    fontSize: 15,
    fontWeight: 700,
    color: "#374151",
    background: "#F3F4F6",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    cursor: "pointer",
  },
};
