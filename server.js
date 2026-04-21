const express = require("express");
const cors    = require("cors");
const path    = require("path");
const fs      = require("fs");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/index.html")));

// ── RESUME DOWNLOAD ────────────────────────────────────
app.get("/api/resume", (req, res) => {
  const resumePath = path.join(__dirname, "resume", "Aakash_Resume.pdf");
  if (!fs.existsSync(resumePath))
    return res.status(404).json({ error: "Resume not found. Place Aakash_Resume.pdf in backend/resume/" });
  res.setHeader("Content-Disposition", 'attachment; filename="Aakash_Yadav_Resume.pdf"');
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(resumePath);
});

// ── CONTACT FORM ───────────────────────────────────────
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: "Name, email, and message are required." });
  console.log(`\n📬 ${name} <${email}> — ${subject || "no subject"}\n${message}\n`);
  const logPath = path.join(__dirname, "messages.json");
  let msgs = [];
  try { msgs = JSON.parse(fs.readFileSync(logPath, "utf-8")); } catch {}
  msgs.push({ name, email, subject, message, ts: new Date().toISOString() });
  fs.writeFileSync(logPath, JSON.stringify(msgs, null, 2));
  res.json({ success: true, message: "Message received!" });
});

app.get("/api/projects", (req, res) => res.json({ projects: [
  { id:1, title:"SmartSathi — AI Elderly Care Companion",    tech:["HTML","CSS","JS","Browser APIs"] },
  { id:2, title:"Desktop Voice Assistant",                   tech:["Python","Speech Recognition","NLP"] },
  { id:3, title:"Smart Rainwater Harvesting System",         tech:["IoT","Python","Sensors"] },
  { id:4, title:"Hospital Management System",                tech:["Python","HTML","CSS","JS","SQL"] },
  { id:5, title:"Event Management System",                   tech:["Python","CSS","HTML","JS","Flask"] },
]}));

app.get("/api/skills", (req, res) => res.json({
  languages:  ["Python","JavaScript","HTML/CSS","C++","Java"],
  frameworks: ["NumPy","Pandas","Flask","Speech Recognition","NLP","Browser APIs"],
  tools:      ["GitHub","VS Code","WordPress"],
  soft:       ["Leadership","Communication"],
}));

app.get("/api/messages", (req, res) => {
  try { res.json(JSON.parse(fs.readFileSync(path.join(__dirname,"messages.json"),"utf-8"))); }
  catch { res.json([]); }
});

app.get("/api/health", (req, res) => res.json({ status:"ok", ts: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio → http://localhost:${PORT}`);
  console.log(`   Resume download → GET /api/resume\n`);
});
