/* =========================================================
   EDIT ME — all the wedding details live here.
   Nothing else in this file needs to change to re-use
   this template for another couple / event.
========================================================= */
const WEDDING_DATA = {
  brideName: "Nasseebah",
  groomName: "Shahbaz",

  invitationEyebrow: "Together with their families",
  scriptLine: "joyfully invite you to their Nikah",

  invitationMessage:
    "With hearts full of gratitude, we request the honour of your presence " +
    "as we begin our journey together as husband and wife, in accordance " +
    "with the blessed Sunnah.",

  date: {
    day: "21",
    weekday: "Saturday",
    month: "November",
    year: "2026"
  },

  time: {
    headline: "4:00 in the evening",
    sub: "Guests kindly seated by 3:45 PM"
  },

  venue: {
    name: "The Rosewood Garden Hall",
    address: "18 Willowmere Lane, Toronto, ON",
    mapUrl: "https://maps.google.com/?q=Toronto+ON"
  },

  closingNote: "With love,"
};

/* =========================================================
   POPULATE CONTENT
========================================================= */
function populateContent(data) {
  const set = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  set("bride-name", data.brideName);
  set("groom-name", data.groomName);
  set("detail-day", data.date.day);
  set("detail-weekday", data.date.weekday);
  set("detail-month", data.date.month);
  set("detail-year", data.date.year);
  set("detail-time", data.time.headline);
  set("detail-time-sub", data.time.sub);
  set("detail-venue", data.venue.name);
  set("detail-venue-address", data.venue.address);

  const msg = document.getElementById("invitation-message");
  if (msg) msg.textContent = data.invitationMessage;

  const link = document.getElementById("venue-link");
  if (link) link.href = data.venue.mapUrl;

  document.title = `${data.brideName} & ${data.groomName} — Walima Invitation`;
}

populateContent(WEDDING_DATA);

/* =========================================================
   REDUCED MOTION — only used to calm decorative extras
   (the ambient canvas). The scroll-driven envelope itself
   stays, since it only moves when the visitor scrolls.
========================================================= */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* =========================================================
   HELPERS
========================================================= */
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const mapRange = (p, start, end) => clamp((p - start) / (end - start));

/* trapezoid opacity/offset helper for a content "leaf" */
function leafState(p, inStart, inEnd, outStart, outEnd) {
  const fadeIn = mapRange(p, inStart, inEnd);
  const fadeOut = outStart == null ? 0 : mapRange(p, outStart, outEnd);
  const opacity = clamp(Math.min(fadeIn, 1 - fadeOut));
  const y = lerp(30, 0, fadeIn) + lerp(0, -26, fadeOut);
  return { opacity, y };
}

/* =========================================================
   SCROLL CHOREOGRAPHY
========================================================= */
{
  const track = document.getElementById("scroll-track");
  const flap = document.getElementById("env-flap");
  const letter = document.getElementById("letter");
  const leaves = Array.from(document.querySelectorAll(".leaf"));
  const scrollHint = document.getElementById("scroll-hint");

  // [inStart, inEnd, outStart, outEnd] per data-leaf value
  const LEAF_TIMING = {
    bismillah: [0.09, 0.16, 0.20, 0.25],
    names: [0.22, 0.29, 0.35, 0.40],
    message: [0.37, 0.44, 0.49, 0.54],
    date: [0.51, 0.58, 0.63, 0.68],
    time: [0.61, 0.68, 0.73, 0.78],
    venue: [0.71, 0.78, 0.84, 0.89],
    closing: [0.85, 0.92, null, null]
  };

  let hintDismissed = false;
  let ticking = false;

  function render() {
    ticking = false;

    const rect = track.getBoundingClientRect();
    const totalScrollable = track.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const p = clamp(totalScrollable > 0 ? scrolled / totalScrollable : 0);

    if (p > 0.01 && !hintDismissed) {
      hintDismissed = true;
      scrollHint.classList.remove("is-visible");
    }

    // --- flap: opens 0.03-0.18, closes 0.90-1.0
    const flapOpen = mapRange(p, 0.03, 0.18);
    const flapClose = mapRange(p, 0.90, 1.0);
    const flapAngle = lerp(0, -172, flapOpen) + lerp(0, 172, flapClose);
    flap.style.transform = `rotateX(${flapAngle}deg)`;

    // --- letter: rises 0.05-0.30, descends 0.88-1.0
    const rise = mapRange(p, 0.05, 0.30);
    const fall = mapRange(p, 0.88, 1.0);
    const ty = lerp(10, -7, rise) + lerp(0, 17, fall);
    const scale = lerp(0.55, 1.03, rise) - lerp(0, 0.48, fall);
    letter.style.transform = `translate(-50%, ${ty}%) scale(${Math.max(
      0.4,
      scale
    )})`;

    // z-index swap so the flap tucks behind once mostly open
    flap.style.zIndex = flapAngle < -70 && flapAngle > -260 ? "2" : "4";

    // --- content leaves
    leaves.forEach((leaf) => {
      const key = leaf.dataset.leaf;
      const timing = LEAF_TIMING[key];
      if (!timing) return;
      const { opacity, y } = leafState(p, ...timing);
      leaf.style.opacity = opacity;
      leaf.style.transform = `translateY(calc(-50% + ${y}px))`;
    });

    // --- seal returns once the flap has sealed shut again
    if (document.body.classList.contains("is-open")) {
      const sealReturn = mapRange(p, 0.95, 1.0);
      seal.style.opacity = String(sealReturn);
      seal.style.transform = `translate(-50%,-50%) scale(${lerp(
        0.5,
        1,
        sealReturn
      )})`;
    }
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(render);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  render();

  /* ---- unlock scroll after the seal is tapped ---- */
  const seal = document.getElementById("seal");
  const tapHint = document.getElementById("tap-hint");

  function openEnvelope() {
    if (document.body.classList.contains("is-open")) return;
    document.body.classList.add("is-open");
    spawnSparkleBurst(seal);

    window.setTimeout(() => {
      document.body.classList.remove("is-locked");
      document.documentElement.classList.remove("is-locked");
      tapHint.style.opacity = "0";
      scrollHint.classList.add("is-visible");
      render();
    }, 650);
  }

  seal.addEventListener("click", () => {
    seal.classList.add("is-popped");
    openEnvelope();
  });
}

/* =========================================================
   SEAL TAP — MAGICAL SPARKLE BURST
========================================================= */
function spawnSparkleBurst(originEl) {
  const layer = document.createElement("div");
  layer.className = "sparkle-layer";
  document.body.appendChild(layer);

  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const GLYPHS = ["\u2726", "\u2727", "\u2739"]; // sparkle glyphs
  const COUNT = 30;

  for (let i = 0; i < COUNT; i++) {
    const kind = i % 5 === 0 ? "petal" : i % 7 === 0 ? "crescent" : "spark";
    const el = document.createElement(kind === "crescent" ? "span" : "i");
    el.className =
      "spark" +
      (kind === "petal" ? " is-petal" : kind === "crescent" ? " is-crescent" : "");

    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 140;
    const ex = Math.cos(angle) * dist;
    const ey = Math.sin(angle) * dist - 30; // slight upward bias

    const size = kind === "petal" ? 7 + Math.random() * 5 : 3 + Math.random() * 4;

    el.style.left = `${cx}px`;
    el.style.top = `${cy}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.setProperty("--spark-end", `translate(${ex}px, ${ey}px)`);
    el.style.setProperty("--spark-rot", `${Math.random() * 360}deg`);
    el.style.animationDuration = `${900 + Math.random() * 500}ms`;
    el.style.animationDelay = `${Math.random() * 120}ms`;

    if (kind === "crescent") {
      el.textContent = GLYPHS[i % GLYPHS.length];
      el.style.width = "auto";
      el.style.height = "auto";
    }

    layer.appendChild(el);
  }

  window.setTimeout(() => layer.remove(), 1700);
}

/* =========================================================
   AMBIENT BACKDROP — drifting petals & fireflies
========================================================= */
(function ambientCanvas() {
  if (prefersReducedMotion) return;

  const canvas = document.getElementById("ambient-canvas");
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  let particles = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle(spawnAtTop, forceKind) {
    const roll = Math.random();
    const kind = forceKind || (roll < 0.46 ? "petal" : roll < 0.86 ? "firefly" : "butterfly");

    const base = {
      x: Math.random() * w,
      y: spawnAtTop ? -20 : Math.random() * h,
      driftPhase: Math.random() * Math.PI * 2,
      kind
    };

    if (kind === "petal") {
      return Object.assign(base, {
        size: 4 + Math.random() * 5,
        speedY: 0.18 + Math.random() * 0.28,
        driftAmp: 10 + Math.random() * 26,
        driftSpeed: 0.0006 + Math.random() * 0.0009,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.006,
        opacity: 0.35 + Math.random() * 0.25
      });
    }

    if (kind === "butterfly") {
      return Object.assign(base, {
        y: Math.random() * h,
        size: 6 + Math.random() * 4,
        speedY: (Math.random() - 0.5) * 0.06,
        speedX: 0.12 + Math.random() * 0.18,
        driftAmp: 18 + Math.random() * 20,
        driftSpeed: 0.0009 + Math.random() * 0.0007,
        flapPhase: Math.random() * Math.PI * 2,
        flapSpeed: 0.006 + Math.random() * 0.004,
        heading: Math.random() < 0.5 ? 1 : -1,
        opacity: 0.5 + Math.random() * 0.3
      });
    }

    // firefly
    return Object.assign(base, {
      size: 1 + Math.random() * 1.6,
      speedY: 0.05 + Math.random() * 0.1,
      driftAmp: 10 + Math.random() * 26,
      driftSpeed: 0.0006 + Math.random() * 0.0009,
      flicker: Math.random() * Math.PI * 2,
      opacity: 0.4 + Math.random() * 0.4
    });
  }

  function init() {
    resize();
    const count = w < 640 ? 14 : 22;
    particles = Array.from({ length: count }, () => makeParticle(false));
    // guarantee a couple of butterflies regardless of the random mix
    particles.push(makeParticle(false, "butterfly"));
    particles.push(makeParticle(false, "butterfly"));
  }

  function drawPetal(p) {
    ctx.fillStyle = `rgba(201,123,132,${p.opacity})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFirefly(p, t) {
    const flick = 0.5 + 0.5 * Math.sin(t * 0.002 + p.flicker);
    ctx.fillStyle = `rgba(216,188,121,${p.opacity * flick})`;
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawButterfly(p, t) {
    const flap = Math.sin(t * p.flapSpeed + p.flapPhase);
    const wingSquash = 0.35 + Math.abs(flap) * 0.65;
    ctx.fillStyle = `rgba(246,241,228,${p.opacity})`;
    ctx.strokeStyle = `rgba(184,147,63,${p.opacity})`;
    ctx.lineWidth = 0.6;

    [-1, 1].forEach((side) => {
      ctx.save();
      ctx.scale(side * wingSquash, 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(p.size * 1.4, -p.size * 1.1, p.size * 0.3, -p.size * 1.6);
      ctx.quadraticCurveTo(-p.size * 0.4, -p.size * 0.6, 0, 0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  function step(t) {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.y += p.speedY;

      if (p.kind === "petal") {
        p.rot += p.rotSpeed;
      }

      let x;
      if (p.kind === "butterfly") {
        p.x += p.speedX * p.heading;
        x = p.x + Math.sin(t * p.driftSpeed + p.driftPhase) * p.driftAmp * 0.3;
        if (p.x < -30 || p.x > w + 30) p.heading *= -1;
      } else {
        x = p.x + Math.sin(t * p.driftSpeed + p.driftPhase) * p.driftAmp;
      }

      if (p.y > h + 20 || p.y < -30) {
        Object.assign(p, makeParticle(p.y > h + 20, p.kind));
      }

      ctx.save();
      ctx.translate(x, p.y);
      if (p.kind === "petal") ctx.rotate(p.rot);

      if (p.kind === "petal") drawPetal(p);
      else if (p.kind === "firefly") drawFirefly(p, t);
      else drawButterfly(p, t);

      ctx.restore();
    });

    window.requestAnimationFrame(step);
  }

  init();
  window.addEventListener("resize", init);
  window.requestAnimationFrame(step);
})();
