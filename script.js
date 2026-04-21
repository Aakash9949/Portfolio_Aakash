/* ══ DATA ═══════════════════════════════════════════════ */
const DATA = {
  tags: ["Python","JavaScript","HTML/CSS","C++","AI / ML","Full-Stack","IoT","Flask"],

  skills: {
    languages:  ["Python","JavaScript","HTML","CSS","C++","Java"],
    frameworks: ["NumPy","Pandas","Flask","Speech Recognition","NLP","Browser APIs"],
    tools:      ["GitHub","VS Code","WordPress","Git"],
    soft:       ["Leadership","Communication","Problem Solving","Team Work"],
  },

  proficiency: [
    { label:"Python",        pct:85 },
    { label:"JavaScript",    pct:80 },
    { label:"HTML / CSS",    pct:90 },
    { label:"C++",           pct:65 },
    { label:"Flask / NLP",   pct:70 },
  ],

  projects: [
    {
      title:"SmartSathi — AI Elderly Care Companion",
      tech:"HTML · CSS · JavaScript · Browser APIs",
      desc:"Voice-enabled AI companion for elderly care with health monitoring, emergency assistance, and daily reminders via real-time browser APIs.",
      tags:["AI","JavaScript","Web"],
      cat:"AI",
    },
    {
      title:"Desktop Voice Assistant",
      tech:"Python · Speech Recognition · NLP",
      desc:"Intelligent desktop assistant performing voice-commanded tasks — web search, system operations — with accurate NLP voice-to-action processing.",
      tags:["Python","AI","NLP"],
      cat:"AI",
    },
    {
      title:"Smart Rainwater Harvesting System",
      tech:"IoT · Python · Sensors",
      desc:"IoT-integrated solution automating water collection and promoting sustainable practices with sensor-based real-time monitoring.",
      tags:["IoT","Python","Hardware"],
      cat:"IoT",
    },
    {
      title:"Hospital Management System",
      tech:"Python · HTML · CSS · JavaScript · SQL",
      desc:"Full-stack app to streamline patient records, appointments, and admin workflows with a role-based dashboard and secure access.",
      tags:["Full-Stack","Python","SQL"],
      cat:"Web",
    },
    {
      title:"Event Management System",
      tech:"Python · CSS · HTML · JavaScript · Flask",
      desc:"Platform for seamless event planning, scheduling, and coordination with attendee registration and real-time organizer updates.",
      tags:["Full-Stack","Flask","Web"],
      cat:"Web",
    },
  ],

  certs: [
    "IT Fundamentals — Udemy",
    "30 Days DSA Bootcamp — Unstop",
    "AI for Beginners — HP",
    "Data Science & Analytics — HP",
    "Intro to Generative AI — AWS",
    "Cybersecurity Analyst Simulation — Tata / Forage",
  ],
};

/* ══ CURSOR ═════════════════════════════════════════════ */
const cur = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");
let mx=0,my=0,rx=0,ry=0;

document.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx+"px"; cur.style.top = my+"px";
});
(function animRing(){
  rx += (mx-rx)*.13; ry += (my-ry)*.13;
  ring.style.left = rx+"px"; ring.style.top = ry+"px";
  requestAnimationFrame(animRing);
})();

/* ══ NAV SCROLL ═════════════════════════════════════════ */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 50);

  // Active nav link
  document.querySelectorAll("section[id]").forEach(sec => {
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (!link) return;
    const { top, bottom } = sec.getBoundingClientRect();
    link.style.color = top < 100 && bottom > 100 ? "var(--text)" : "";
  });
});

/* ══ HAMBURGER ══════════════════════════════════════════ */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
hamburger.addEventListener("click", () => mobileMenu.classList.toggle("open"));
mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("open")));

/* ══ RESUME DOWNLOAD ════════════════════════════════════ */
function downloadResume() {
  // Try backend first, fallback to direct link
  const link = document.createElement("a");
  link.href = "http://localhost:3000/api/resume";
  link.download = "Aakash_Yadav_Resume.pdf";
  link.click();
}

document.getElementById("download-btn").addEventListener("click", downloadResume);
const mobileResume = document.getElementById("mobile-resume");
if (mobileResume) mobileResume.addEventListener("click", e => { e.preventDefault(); downloadResume(); });

/* ══ HERO TAGS ══════════════════════════════════════════ */
const htContainer = document.getElementById("hero-tags");
DATA.tags.forEach((t,i) => {
  const s = document.createElement("span");
  s.className = "tag reveal"; s.textContent = t;
  s.style.animationDelay = (.4 + i*.05)+"s";
  htContainer.appendChild(s);
});

/* ══ COUNTER ANIMATION ══════════════════════════════════ */
function animateCount(el, target) {
  let start = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(start);
  }, 40);
}

const counters = document.querySelectorAll(".stat-num[data-target]");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target, +e.target.dataset.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: .5 });
counters.forEach(c => counterObserver.observe(c));

/* ══ SKILLS ═════════════════════════════════════════════ */
const tabsEl = document.getElementById("skill-tabs");
const tagsEl = document.getElementById("skill-tags");
let activeTab = "languages";

function renderTabs() {
  tabsEl.innerHTML = "";
  Object.keys(DATA.skills).forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (cat === activeTab ? " active" : "");
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.dataset.tab = cat;
    btn.addEventListener("click", () => { activeTab = cat; renderTabs(); renderTags(); });
    tabsEl.appendChild(btn);
  });
}

function renderTags() {
  tagsEl.innerHTML = "";
  DATA.skills[activeTab].forEach((s,i) => {
    const span = document.createElement("span");
    span.className = "s-tag fade-in";
    span.textContent = s;
    span.style.transitionDelay = (i*.05)+"s";
    tagsEl.appendChild(span);
    requestAnimationFrame(() => span.classList.add("visible"));
  });
}

renderTabs(); renderTags();

// Proficiency bars
const barsEl = document.getElementById("prof-bars");
DATA.proficiency.forEach(p => {
  barsEl.innerHTML += `
    <div class="prof-bar fade-in">
      <div class="prof-label"><span>${p.label}</span><span>${p.pct}%</span></div>
      <div class="prof-track"><div class="prof-fill" data-pct="${p.pct}"></div></div>
    </div>`;
});

const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(".prof-fill").forEach(f => {
        f.style.width = f.dataset.pct + "%";
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: .2 });
document.querySelectorAll(".prof-bar").forEach(b => barObserver.observe(b));

/* ══ PROJECTS ═══════════════════════════════════════════ */
const allCats = ["All", ...new Set(DATA.projects.map(p => p.cat))];
const filterEl = document.getElementById("proj-filters");
const gridEl   = document.getElementById("proj-grid");
let activeFilter = "All";

function renderFilters() {
  filterEl.innerHTML = "";
  allCats.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (cat === activeFilter ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => { activeFilter = cat; renderFilters(); renderProjects(); });
    filterEl.appendChild(btn);
  });
}

function renderProjects() {
  const filtered = activeFilter === "All" ? DATA.projects : DATA.projects.filter(p => p.cat === activeFilter);
  gridEl.innerHTML = "";
  filtered.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "proj-card fade-in";
    card.style.transitionDelay = (i * .08) + "s";
    card.innerHTML = `
      <div class="proj-num">${String(i+1).padStart(2,"0")} /</div>
      <h3>${p.title}</h3>
      <div class="proj-tech">${p.tech}</div>
      <p class="proj-desc">${p.desc}</p>
      <div class="proj-tags">${p.tags.map(t=>`<span class="proj-tag">${t}</span>`).join("")}</div>`;
    gridEl.appendChild(card);
    requestAnimationFrame(() => card.classList.add("visible"));
  });
}

renderFilters(); renderProjects();

/* ══ CERTIFICATIONS ═════════════════════════════════════ */
const certGrid = document.getElementById("cert-grid");
DATA.certs.forEach(c => {
  certGrid.innerHTML += `<span class="cert-badge">🏅 ${c}</span>`;
});

/* ══ CONTACT FORM ════════════════════════════════════════ */
const form   = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async e => {
  e.preventDefault();
  const btn = document.getElementById("submit-btn");
  btn.textContent = "Sending…";
  btn.disabled = true;

  const payload = {
    name:    form.name.value,
    email:   form.email.value,
    subject: form.subject.value,
    message: form.message.value,
  };

  try {
    const res = await fetch("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      status.textContent = "✓ Message sent! I'll reply soon.";
      status.className = "form-status ok";
      form.reset();
    } else throw new Error();
  } catch {
    status.textContent = "✓ Demo mode — connect backend to enable real sending.";
    status.className = "form-status ok";
    form.reset();
  }
  btn.textContent = "Send Message →";
  btn.disabled = false;
  setTimeout(() => (status.textContent = ""), 5000);
});

/* ══ SCROLL REVEAL ══════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll(
  ".t-card, .cert-badge, .proj-card, .c-link, .info-item, .pill, .prof-bar, .stat-card, .about-left p"
).forEach(el => {
  el.classList.add("fade-in");
  revealObserver.observe(el);
});
