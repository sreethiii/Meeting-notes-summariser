"use client";
import { useState } from "react";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("Summarize in bullet points for executives");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState("");
  const [status, setStatus] = useState("");

  const handleFile = async (file: File) => {
    const text = await file.text();
    setTranscript(text);
  };

  const generate = async () => {
  setLoading(true);
  setStatus("");
  try {
    const res = await fetch("http://127.0.0.1:8000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, prompt }),
    });

    const data = await res.json();
    setSummary(data.summary);
  } catch (err) {
    console.error("Error generating summary:", err);
    setStatus("❌ Failed to generate summary.");
  } finally {
    setLoading(false);
  }
};

  const share = async () => {
  if (!summary || !emails) return;

  setStatus("Sending email...");
  try {
    const res = await fetch("http://127.0.0.1:8000/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary, emails }),
    });

    const data = await res.json();
    setStatus(data.status);
  } catch (err) {
    console.error("Error sending email:", err);
    setStatus("❌ Failed to send email.");
  }
};


  return (
    <main style={{ maxWidth: 800, margin: "32px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Meeting Notes Summarizer</h1>

      <section style={{ margin: "16px 0" }}>
        <label>Upload .txt transcript: </label>{" "}
        <input
          type="file"
          accept=".txt"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </section>

      <section style={{ margin: "16px 0" }}>
        <label>Or paste transcript:</label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={8}
          style={{ width: "100%" }}
        />
      </section>

      <section style={{ margin: "16px 0" }}>
        <label>Instruction / Prompt:</label>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%" }}
        />
      </section>

      <button onClick={generate} disabled={loading || !transcript}>
        {loading ? "Generating..." : "Generate Summary"}
      </button>

      <section style={{ margin: "16px 0" }}>
        <label>Editable Summary:</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={10}
          style={{ width: "100%" }}
        />
      </section>

      <section style={{ margin: "16px 0" }}>
        <label>Share via email (comma-separated):</label>
        <input
          placeholder="alice@x.com, bob@y.com"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          style={{ width: "100%" }}
        />
        <div style={{ marginTop: 8 }}>
          <button onClick={share} disabled={!summary || !emails}>Send</button>
        </div>
      </section>

      {status && <p>{status}</p>}
    </main>
  );
}
