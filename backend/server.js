import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { findTempFiles } from "./cleanupScanner.js";
import { summarizeAnswer } from "./summarizer.js";
import dotenv from "dotenv";
dotenv.config(); 
console.log("🔑 GEMINI KEY:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "NOT FOUND ❌");
import {
  startSession,
  stopSession,
  getStats,
  getAllSessions,
  formatDuration,
  sessions,
  currentSession,
} from "./stats.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5070;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Welcome! Use /start, /stop, /stats for session tracking and /cleanup-suggestions, /delete-temp for cleanup. Hope you'll like it!"
  );
});

app.post("/start", (req, res) => {
  try {
    const session = startSession();
    res.json({
      message: "Coding session started",
      startTime: session.startTime,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/stop", (req, res) => {
  try {
    const session = stopSession();
    res.json({
      message: "Coding session stopped.",
      duration: formatDuration(session.durationMs),
      session,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/stats", (req, res) => {
  const stats = getStats();
  res.json({
    totalSessions: stats.totalSession,
    totalTime: formatDuration(stats.totalTimeMs),
  });
});

app.get("/sessions", (req, res) => {
  const sessions = getAllSessions().map((element, index) => ({
    id: index + 1,
    startTime: element.startTime,
    endTime: element.endTime,
    duration: formatDuration(element.durationMs),
  }));
  res.json(sessions);
});

app.get("/cleanup-suggestions", (req, res) => {
  const folderPath = req.query.path;
  if (!folderPath)
    return res.status(400).json({ error: "Missing folder path" });

  const absPath = path.resolve(folderPath);
  if (!fs.existsSync(absPath))
    return res.status(400).json({ error: "Folder does not exist" });

  try {
    const tempFiles = findTempFiles(absPath);
    res.json({ folder: absPath, suggestions: tempFiles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/delete-temp", (req, res) => {
  const { paths } = req.body;
  if (!Array.isArray(paths))
    return res.status(400).json({ error: "Expected 'paths' array" });

  const deleted = [];

  for (const p of paths) {
    const abs = path.resolve(p);
    try {
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) {
        fs.rmSync(abs, { recursive: true, force: true });
      } else {
        fs.unlinkSync(abs);
      }
      deleted.push(abs);
    } catch (err) {
      console.warn(`Failed to delete: ${abs}`, err.message);
    }
  }

  res.json({ deleted });
});

app.post("/api/summarize", async (req, res) => {
  const { answerText } = req.body;
  if (!answerText) return res.status(400).json({ summary: "Missing answerText" });

  const summary = await summarizeAnswer(answerText);
  res.json({ summary });
});


app.listen(PORT, () => {
  console.log(`Cleanup API running at http://localhost:${PORT}`);
});
