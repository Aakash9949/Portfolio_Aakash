// ══════════════════════════════════════════════════════
//  Aakash Yadav Portfolio — server.js
//
//  SETUP (one-time):
//    1. npm install
//    2. Copy .env.example → .env
//    3. Fill in MAIL_USER, MAIL_PASS, MAIL_TO in .env
//    4. Create subfolder:  resume/
//    5. Place Aakash_Resume.pdf inside  resume/
//    6. node server.js
//    7. Open http://localhost:3000
//
//  HOW TO GET GMAIL APP PASSWORD:
//    → myaccount.google.com → Security
//    → 2-Step Verification (enable it)
//    → App Passwords → create one named "Portfolio"
//    → Paste the 16-char password into .env as MAIL_PASS
// ══════════════════════════════════════════════════════

require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const path       = require("path");
const fs         = require("fs");
const nodemailer = require("nodemailer");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Email transporter (Gmail) ──────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Verify email config on startup
transporter.verify((err) => {
  if (err) {
    console.warn("\n⚠️  Email not configured — messages will only be saved locally.");
    console.warn("   Fill in MAIL_USER and MAIL_PASS in your .env file to enable real emails.\n");
  } else {
    console.log(`\n✅ Email ready → messages will be sent to ${process.env.MAIL_TO}\n`);
  }
});

// ── Middleware ─────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));   // serves index.html, style.css, script.js

// ── Routes ─────────────────────────────────────────────

// Home
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

// ── POST /api/contact ──────────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: "Name, email, and message are required." });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ success: false, message: "Please enter a valid email address." });

  // ── 1. Save to messages.json (always) ────────────────
  const logPath = path.join(__dirname, "messages.json");
  let msgs = [];
  try { msgs = JSON.parse(fs.readFileSync(logPath, "utf-8")); } catch {}
  msgs.push({
    name, email,
    subject: subject || "(no subject)",
    message,
    ts: new Date().toISOString(),
  });
  fs.writeFileSync(logPath, JSON.stringify(msgs, null, 2));

  console.log(`\n📬 New message from ${name} <${email}>`);
  console.log(`   Subject: ${subject || "(none)"}`);
  console.log(`   Message: ${message}\n`);

  // ── 2. Send email via Gmail (if configured) ───────────
  const emailConfigured =
    process.env.MAIL_USER &&
    process.env.MAIL_PASS &&
    process.env.MAIL_PASS !== "your_16_char_app_password_here";

  if (emailConfigured) {
    try {
      // Email to YOU (notification)
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
        to:   process.env.MAIL_TO || process.env.MAIL_USER,
        replyTo: email,
        subject: `📩 Portfolio Message: ${subject || "New contact from " + name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#e2e8f0;border-radius:12px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#6d28d9,#06b6d4);padding:24px 32px;">
              <h2 style="margin:0;color:#fff;font-size:20px;">New Portfolio Message</h2>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">via aakashyadav.dev</p>
            </div>
            <div style="padding:32px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#64748b;font-size:13px;width:80px;">From</td>
                  <td style="padding:8px 0;font-weight:600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;font-size:13px;">Email</td>
                  <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#06b6d4;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;font-size:13px;">Subject</td>
                  <td style="padding:8px 0;">${subject || "(no subject)"}</td>
                </tr>
              </table>
              <div style="margin-top:24px;padding:20px;background:#111124;border-radius:8px;border-left:3px solid #6d28d9;">
                <p style="margin:0;font-size:14px;line-height:1.7;color:#e2e8f0;">${message.replace(/\n/g, "<br/>")}</p>
              </div>
              <p style="margin-top:24px;font-size:12px;color:#64748b;">
                Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST<br/>
                Reply directly to this email to respond to ${name}.
              </p>
            </div>
          </div>`,
      });

      // Auto-reply to sender
      await transporter.sendMail({
        from: `"Aakash Yadav" <${process.env.MAIL_USER}>`,
        to:   email,
        subject: `Thanks for reaching out, ${name}! 👋`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#e2e8f0;border-radius:12px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#6d28d9,#06b6d4);padding:24px 32px;">
              <h2 style="margin:0;color:#fff;">Thanks for getting in touch!</h2>
            </div>
            <div style="padding:32px;">
              <p style="color:#e2e8f0;line-height:1.7;">Hi <strong>${name}</strong>,</p>
              <p style="color:#64748b;line-height:1.7;">
                Thank you for reaching out through my portfolio. I've received your message and will get back to you as soon as possible, usually within 24–48 hours.
              </p>
              <div style="margin:24px 0;padding:16px;background:#111124;border-radius:8px;border-left:3px solid #06b6d4;">
                <p style="margin:0;font-size:13px;color:#64748b;">Your message:</p>
                <p style="margin:8px 0 0;font-size:14px;color:#e2e8f0;">${message.replace(/\n/g, "<br/>")}</p>
              </div>
              <p style="color:#64748b;line-height:1.7;">Looking forward to connecting!</p>
              <p style="color:#e2e8f0;margin-top:24px;">
                <strong>Aakash Yadav</strong><br/>
                <span style="color:#64748b;font-size:13px;">Full-Stack Developer &amp; AI Enthusiast</span><br/>
                <a href="https://linkedin.com/in/aakash-yadav-041023326" style="color:#06b6d4;font-size:13px;">LinkedIn</a>
                &nbsp;·&nbsp;
                <a href="https://github.com/Aakash9949" style="color:#06b6d4;font-size:13px;">GitHub</a>
              </p>
            </div>
          </div>`,
      });

      console.log(`✅ Emails sent — notification to you, auto-reply to ${email}`);
      return res.json({ success: true, message: "Message sent! I'll reply soon." });

    } catch (emailErr) {
      console.error("❌ Email error:", emailErr.message);
      // Message was saved locally even if email failed
      return res.json({
        success: true,
        message: "Message received! (Email delivery failed — check .env config)",
      });
    }
  }

  // Email not configured — message saved locally only
  res.json({ success: true, message: "Message received! I'll get back to you soon." });
});

// ── GET /api/resume ────────────────────────────────────
app.get("/api/resume", (req, res) => {
  const p = path.join(__dirname, "resume", "Aakash_Resume.pdf");
  if (!fs.existsSync(p))
    return res.status(404).json({ error: "Create resume/ folder and place Aakash_Resume.pdf inside." });
  res.setHeader("Content-Disposition", 'attachment; filename="Aakash_Yadav_Resume.pdf"');
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(p);
});

// ── GET /api/projects ──────────────────────────────────
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

// ── GET /api/skills ────────────────────────────────────
app.get("/api/skills", (req, res) => res.json({
  languages:  ["Python","JavaScript","HTML/CSS","C++","Java"],
  frameworks: ["NumPy","Pandas","Flask","Speech Recognition","NLP","Browser APIs"],
  tools:      ["GitHub","VS Code","WordPress"],
  database:   ["SQL","MongoDB"],
  soft:       ["Leadership","Communication"],
}));

// ── GET /api/messages (admin) ──────────────────────────
app.get("/api/messages", (req, res) => {
  try { res.json(JSON.parse(fs.readFileSync(path.join(__dirname,"messages.json"),"utf-8"))); }
  catch { res.json([]); }
});

// ── GET /api/health ────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.json({ status:"ok", email: !!process.env.MAIL_PASS, ts:new Date().toISOString() })
);

// ── 404 ────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error:"Route not found" }));

// ── Start ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio  → http://localhost:${PORT}`);
  console.log(`   Resume    → GET  /api/resume`);
  console.log(`   Contact   → POST /api/contact`);
  console.log(`   Messages  → GET  /api/messages`);
});
