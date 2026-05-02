// ══════════════════════════════════════════════════════
//  Aakash Yadav Portfolio — server.js
//  Flat structure: index.html, style.css, script.js,
//                  server.js, package.json all in ONE folder
//
//  SETUP:
//    1. npm install
//    2. Create subfolder:  resume/
//    3. Place Aakash_Resume.pdf inside resume/
//    4. node server.js
//    5. Open http://localhost:3000
// ══════════════════════════════════════════════════════

const express = require("express");
const cors    = require("cors");
const path    = require("path");
const fs      = require("fs");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve index.html, style.css, script.js from same folder
app.use(express.static(__dirname));

// Home
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// RESUME DOWNLOAD
app.get("/api/resume", (req, res) => {
  const p = path.join(__dirname, "resume", "Aakash_Resume.pdf");
  if (!fs.existsSync(p))
    return res.status(404).json({ error: "Create resume/ folder and put Aakash_Resume.pdf inside." });
  res.setHeader("Content-Disposition", 'attachment; filename="Aakash_Yadav_Resume.pdf"');
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(p);
});

// CONTACT FORM
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: "Name, email, and message required." });
  console.log(`\n📬 ${name} <${email}> — ${subject || "no subject"}\n${message}\n`);
  const log = path.join(__dirname, "messages.json");
  let msgs = [];
  try { msgs = JSON.parse(fs.readFileSync(log, "utf-8")); } catch {}
  msgs.push({ name, email, subject, message, ts: new Date().toISOString() });
  fs.writeFileSync(log, JSON.stringify(msgs, null, 2));
  res.json({ success: true, message: "Message received!" });
});

// PROJECTS
app.get("/api/projects", (req, res) => res.json({ projects: [
  { id:1, title:"SmartSathi — AI Elderly Care Companion",
    tech:["HTML","CSS","JavaScript","Browser APIs"],
    github:"https://github.com/akshita0819/SmartSaathi",
    live:"https://smartsaathi.onrender.com/" },
  { id:2, title:"Smart Rainwater Harvesting System",
    tech:["IoT","Python","Sensors"],
    github:"https://github.com/Aakash9949/LAB_2_INDIGENOUS_RAINWATER_PROJECT",
    live:"https://aakash9949.github.io/LAB_2_INDIGENOUS_RAINWATER_PROJECT/" },
  { id:3, title:"Hospital Management System",
    tech:["Python","HTML","CSS","JavaScript","SQL"],
    github:"https://github.com/Aakash9949/HOSPITAL_MANAGEMENT",
    live:"https://aakash9949.github.io/HOSPITAL_MANAGEMENT/" },
  { id:4, title:"Event Management System",
    tech:["Python","CSS","HTML","JavaScript","Flask"],
    github:"https://github.com/Aakash9949/WEB_EVENT_MANAGEMENT",
    live:"https://aakash9949.github.io/WEB_EVENT_MANAGEMENT/" },
]}));

// SKILLS
app.get("/api/skills", (req, res) => res.json({
  languages:  ["Python","JavaScript","HTML/CSS","C++","Java"],
  frameworks: ["NumPy","Pandas","Flask","Speech Recognition","NLP","Browser APIs"],
  tools:      ["GitHub","VS Code","WordPress"],
  database:   ["SQL","MongoDB"],
  soft:       ["Leadership","Communication"],
}));

// MESSAGES (admin)
app.get("/api/messages", (req, res) => {
  try { res.json(JSON.parse(fs.readFileSync(path.join(__dirname,"messages.json"),"utf-8"))); }
  catch { res.json([]); }
});

app.get("/api/health", (req, res) => res.json({ status:"ok", ts:new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ error:"Route not found" }));

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio → http://localhost:${PORT}`);
  console.log(`   Resume   → GET  /api/resume\n`);
});
