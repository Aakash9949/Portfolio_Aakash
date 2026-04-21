// === DATA ===
const skills = [
  { name: "Python", hot: true }, { name: "JavaScript", hot: true },
  { name: "HTML/CSS", hot: true }, { name: "C++", hot: false },
  { name: "Java", hot: false }, { name: "NumPy", hot: false },
  { name: "Pandas", hot: false }, { name: "Speech Recognition", hot: true },
  { name: "NLP", hot: true }, { name: "Browser APIs", hot: false },
  { name: "GitHub", hot: false }, { name: "VS Code", hot: false },
  { name: "WordPress", hot: false }, { name: "IoT", hot: false },
];

const projects = [
  {
    title: "SmartSathi — AI Elderly Care Companion",
    tech: "HTML · CSS · JavaScript · Browser APIs",
    desc: "Voice-enabled AI companion for elderly care with health monitoring, emergency assistance, and daily reminders via real-time browser APIs.",
  },
  {
    title: "Desktop Voice Assistant",
    tech: "Python · Speech Recognition · NLP",
    desc: "Intelligent desktop assistant performing tasks via voice commands — web search, system operations — with accurate voice-to-action NLP processing.",
  },
  {
    title: "Smart Rainwater Harvesting System",
    tech: "IoT · Python · Sensors",
    desc: "IoT-integrated solution automating water collection and promoting sustainable practices with real-time sensor-based level monitoring.",
  },
  {
    title: "Hospital Management System",
    tech: "Python · HTML/CSS · JavaScript",
    desc: "Full-stack app streamlining patient records, appointments, and administrative workflows with a role-based dashboard interface.",
  },
  {
    title: "Event Management System",
    tech: "HTML · CSS · JavaScript · Python",
    desc: "Platform enabling seamless planning, scheduling, and coordination of events with attendee registration and real-time organizer updates.",
  },
];

const certs = [
  "IT Fundamentals — Udemy",
  "30 Days DSA Bootcamp — Unstop",
  "AI for Beginners — HP",
  "Data Science & Analytics — HP",
  "Intro to Generative AI — AWS",
  "Cybersecurity Analyst Simulation — Tata / Forage",
];

// === CURSOR ===
const cursor = document.querySelector(".cursor");
const trail = document.querySelector(".cursor-trail");
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + "px";
  cursor.style.top = my + "px";
});

function animTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.left = tx + "px";
  trail.style.top = ty + "px";
  requestAnimationFrame(animTrail);
}
animTrail();

// Big on hover
document.querySelectorAll("a, button, .btn, .project-card, .skill-tag").forEach(el => {
  el.addEventListener("mouseenter", () => cursor.style.transform = "translate(-50%,-50%) scale(2.5)");
  el.addEventListener("mouseleave", () => cursor.style.transform = "translate(-50%,-50%) scale(1)");
});

// === RENDER SKILLS ===
const sg = document.getElementById("skills-grid");
skills.forEach(s => {
  const span = document.createElement("span");
  span.className = "skill-tag" + (s.hot ? " hot" : "");
  span.textContent = s.name;
  sg.appendChild(span);
});

// === RENDER PROJECTS ===
const pg = document.getElementById("projects-grid");
projects.forEach((p, i) => {
  pg.innerHTML += `
    <div class="project-card" style="animation-delay:${i * 0.07}s">
      <div class="project-num">${String(i + 1).padStart(2, "0")} /</div>
      <h3>${p.title}</h3>
      <div class="project-tech">${p.tech}</div>
      <p>${p.desc}</p>
      <div class="project-links">
        <a href="#" class="project-link">→ View Project</a>
        <a href="#" class="project-link">↗ GitHub</a>
      </div>
    </div>`;
});

// === RENDER CERTS ===
const cg = document.getElementById("certs-grid");
certs.forEach(c => {
  cg.innerHTML += `<span class="cert-badge">🏅 ${c}</span>`;
});

// === CONTACT FORM ===
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("submit-btn");
  btn.textContent = "Sending...";
  btn.disabled = true;

  const data = {
    name: form.name.value,
    email: form.email.value,
    subject: form.subject.value,
    message: form.message.value,
  };

  try {
    const res = await fetch("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      status.textContent = "✓ Message sent! I'll get back to you soon.";
      status.className = "form-status success";
      form.reset();
    } else {
      throw new Error(result.message);
    }
  } catch {
    // Demo fallback when backend not running
    status.textContent = "✓ Demo: Message received! (Connect backend to enable real sending)";
    status.className = "form-status success";
    form.reset();
  }

  btn.textContent = "Send Message →";
  btn.disabled = false;
  setTimeout(() => (status.textContent = ""), 5000);
});

// === SCROLL REVEAL ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("visible");
  });
}, { threshold: 0.1 });

document.querySelectorAll(".project-card, .skill-tag, .timeline-item, .cert-badge").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  observer.observe(el);
});

// Visible state triggered by IntersectionObserver
const style = document.createElement("style");
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// === RESUME DOWNLOAD ===
document.getElementById("resume-btn").addEventListener("click", (e) => {
  e.preventDefault();
  // Redirect to backend endpoint for resume download
  window.open("http://localhost:3000/api/resume", "_blank");
});

// === NAV ACTIVE STATE ===
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");
  let current = "";
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  links.forEach(l => {
    l.style.color = l.getAttribute("href") === `#${current}` ? "var(--text)" : "";
  });
});