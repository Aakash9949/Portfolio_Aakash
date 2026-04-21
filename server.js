// server.js — Aakash Yadav Portfolio Backend
// Run: npm install && node server.js

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// ── Routes ─────────────────────────────────────────────

// Home — serve portfolio
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// POST /api/contact — handle contact form
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required." });
  }

  // Log message to console (in production: send email / save to DB)
  console.log("\n📬 New Contact Message");
  console.log("──────────────────────");
  console.log(`From   : ${name} <${email}>`);
  console.log(`Subject: ${subject || "(none)"}`);
  console.log(`Message: ${message}`);
  console.log("──────────────────────\n");

  // Save to a local JSON log
  const logPath = path.join(__dirname, "messages.json");
  let messages = [];
  if (fs.existsSync(logPath)) {
    try { messages = JSON.parse(fs.readFileSync(logPath, "utf-8")); } catch {}
  }
  messages.push({ name, email, subject, message, timestamp: new Date().toISOString() });
  fs.writeFileSync(logPath, JSON.stringify(messages, null, 2));

  res.json({ success: true, message: "Message received!" });
});

// GET /api/resume — serve resume PDF download
app.get("/api/resume", (req, res) => {
  const resumePath = path.join(__dirname, "resume/Aakash_Resume.pdf");
  if (fs.existsSync(resumePath)) {
    res.download(resumePath, "Aakash_Yadav_Resume.pdf");
  } else {
    res.status(404).json({ error: "Resume not found. Place Aakash_Resume.pdf in backend/resume/" });
  }
});

// GET /api/projects — return projects JSON
app.get("/api/projects", (req, res) => {
  res.json({
    projects: [
      {
        id: 1, title: "SmartSathi — AI Elderly Care Companion",
        tech: ["HTML", "CSS", "JavaScript", "Browser APIs"],
        description: "Voice-enabled AI companion for elderly care with health monitoring and emergency assistance.",
      },
      {
        id: 2, title: "Desktop Voice Assistant",
        tech: ["Python", "Speech Recognition", "NLP"],
        description: "Intelligent desktop assistant performing tasks via voice commands.",
      },
      {
        id: 3, title: "Smart Rainwater Harvesting System",
        tech: ["IoT", "Python", "Sensors"],
        description: "Automated water collection system promoting sustainable practices.",
      },
      {
        id: 4, title: "Hospital Management System",
        tech: ["Python", "HTML/CSS", "JavaScript"],
        description: "Streamlines patient records, appointments, and admin workflows.",
      },
      {
        id: 5, title: "Event Management System",
        tech: ["HTML", "CSS", "JavaScript", "Python"],
        description: "Platform for seamless event planning, scheduling, and coordination.",
      },
    ]
  });
});

// GET /api/skills — return skills JSON
app.get("/api/skills", (req, res) => {
  res.json({
    languages: ["Python", "JavaScript", "HTML/CSS", "C++", "Java"],
    frameworks: ["NumPy", "Pandas", "Speech Recognition", "NLP", "Browser APIs"],
    tools: ["GitHub", "VS Code", "WordPress"],
  });
});

// GET /api/messages — view all messages (protect in production!)
app.get("/api/messages", (req, res) => {
  const logPath = path.join(__dirname, "messages.json");
  if (fs.existsSync(logPath)) {
    res.json(JSON.parse(fs.readFileSync(logPath, "utf-8")));
  } else {
    res.json([]);
  }
});

// ── 404 fallback ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Start ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Aakash Portfolio Server running at http://localhost:${PORT}`);
  console.log(`   Frontend : http://localhost:${PORT}/`);
  console.log(`   Contact  : POST http://localhost:${PORT}/api/contact`);
  console.log(`   Resume   : GET  http://localhost:${PORT}/api/resume`);
  console.log(`   Projects : GET  http://localhost:${PORT}/api/projects\n`);
});
