"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PaymentModal from "./components/Paymentmodal.jsx";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content: edit everything here                                       */
/* ------------------------------------------------------------------ */
const SHOW = {
  name: "Vronix Digital",
  host: "Vrushu Kubani",
  hostRole: "Host and producer",
};


// Demo images (Unsplash). Replace the src values with your own files.
// If a URL fails to load, <Img> falls back to a placeholder from picsum.photos.
const unsplash = (id, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMG = {
  mic: { src: unsplash("photo-1590602847861-f357a9332bbc"), seed: "mic" },
  studio: { src: unsplash("photo-1598488035139-bdbb2231ce04", 2400), seed: "studio" },
  host: { src: unsplash("photo-1560250097-0b93528c311a", 500), seed: "host" },
  business: { src: unsplash("photo-1573497019940-1c28c88b4f3e", 1200), seed: "business" },
  creator: { src: unsplash("photo-1531123897727-8f129e1688ce", 1000), seed: "creator" },
};

const NAV = [
  { label: "Discover", href: "#discover" },
  { label: "Categories", href: "#guests" },
  { label: "Join A Podcast", href: "#book" },
];

const STATEMENT = [
  { t: "Curated conversations designed to spark ", em: false },
  { t: "creativity", em: true },
  { t: ", ", em: false },
  { t: "build connection", em: true },
  {
    t: ", and invite everyone to the table. Whether you’re into founder stories, creator culture, or the messy middle of building something, there’s a mic waiting for you.",
    em: false,
  },
];



const PACKAGES = [
  {
    id: "signature",
    name: "Podcast session",
    price: 10000,
    meta: "30-minute recording. Full edit, vertical reels for social, and show notes that link to your business.",
  },
];

const CASE_STUDIES = [
  // {
  //   name: "Ember & Oak",
  //   role: "D2C candle brand",
  //   views: "182K",
  //   engagement: "9.4%",
  //   followers: "+4,200",
  //   performance: "3.1x avg. reach",
  //   sales: "₹1.8L in sales, 30 days",
  // },
  // {
  //   name: "Loomwork",
  //   role: "B2B SaaS",
  //   views: "96K",
  //   engagement: "6.8%",
  //   followers: "+1,650",
  //   performance: "2.4x avg. reach",
  //   sales: "38 qualified leads",
  // },
  {
    name: "Soniya_asthetic_beauty_salon",
    role: "Salon and beauty services",
    views: "977.2k",
    ProfileVisits: "1.2k",
    followers: "+1000",
    performance: "4x avg. reach",
    sales: "400+ Enquiries generated",
  },
];

const DELIVERABLES = [
  "One highlighted story, shaped around your business",
  "2–3 hour shoot at our studio",
  "One 20–30 minute long-form video",
  "10–15 short vertical clips, cut for Reels and Shorts",
  "Fully edited, posted on the guest’s own social pages",
  "Minimum 3 reels built with viral-reach potential among 7 reels",
];

// Demo time slots for the booking calendar. Swap this for real availability
// from your calendar provider (Cal.com, Calendly, Google Calendar, etc).
const SLOT_TIMES = ["10:00 AM", "12:30 PM", "3:00 PM"];

const FAQ = [
  {
    q: "What happens after I book?",
    a: "You get a confirmation email within a hours. Within 24 hours we send a short questionnaire and a calendar link to lock your recording slot.",
  },
  {
    q: "Do I need any equipment?",
    a: "No. Record your podcast in our professional podcast studio, fully equipped with everything you need for a high-quality recording experience.",
  },
  {
    q: "Can I reschedule?",
    a: "Yes. Move your slot for free up to 48 hours before the session. After that, we move it once at no charge.",
  },
  {
    q: "Who owns the episode?",
    a: "You can reuse your clips and audio anywhere. We publish the full episode on the show’s channels with your approval.",
  },
];

const TESTED_IMAGES = [
  "/tested/1.png", "/tested/3.png", "/tested/4.png",
  "/tested/5.jpeg", "/tested/6.jpeg", "/tested/7.jpeg", "/tested/8.jpeg",
  "/tested/9.jpeg", "/tested/10.jpeg", "/tested/11.jpeg", "/tested/12.jpeg",
  "/tested/13.jpeg", "/tested/14.jpeg",
];

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */
function Img({ src, seed, w = 1200, h = 800, alt = "", ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = `https://picsum.photos/seed/${seed}/${w}/${h}`;
      }}
      {...props}
    />
  );
}

// India: whole rupees, grouped with the en-IN convention (e.g. ₹1,00,000).
const money = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function Counter({ to, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setVal,
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Hero (GSAP: one orchestrated load sequence)                         */
/* ------------------------------------------------------------------ */
function Hero() {
  const root = useRef(null);
  const box = useRef(null);
  const title = useRef(null);

  useLayoutEffect(() => {
    let cancelled = false;
    let tl;

    // Scale the headline so it fills the container width exactly.
    const fit = () => {
      if (!box.current || !title.current) return;
      title.current.style.fontSize = "100px";
      const natural = title.current.getBoundingClientRect().width;
      title.current.style.fontSize = `${(100 * box.current.clientWidth) / natural}px`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box.current);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
        tl.from(".hero__char", { yPercent: 115, duration: 1.1, stagger: 0.04 })
          .from(".hero__mic", { y: 90, opacity: 0, duration: 1.5, ease: "power3.out" }, 0)
          .from(
            [".hero__tagline", ".hero__nav a", ".hero__meta a"],
            { opacity: 0, y: 14, duration: 0.9, stagger: 0.07 },
            0.45
          );
      });
    }, root);

    // Wait for the display font so the fit and the animation use the real glyphs.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      fit();
      if (tl) tl.play();
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <header className="hero" ref={root} id="top">
      <p className="hero__tagline">
        Start a podcast with us. Real stories, honest conversations, and a mic that's ready
        when you are.
      </p>

      <nav className="hero__nav" aria-label="Primary">
        {NAV.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <Img
        className="hero__mic"
        src={IMG.mic.src}
        seed={IMG.mic.seed}
        w={1000}
        h={1200}
        alt="Studio condenser microphone on a shock mount"
        loading="eager"
      />

      <div className="hero__title-box" ref={box}>
        <h1 className="hero__title" ref={title} aria-label="Listen. Feel. Connect.">
          {["LISTEN.", "FEEL.", "CONNECT."].map((word) => (
            <span className="hero__word" aria-hidden="true" key={word}>
              {[...word].map((ch, i) => (
                <span className="hero__char" key={i}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>

      <div className="hero__meta">
        <a href="#podcast-structure">Podcast Structure</a>
        <a href="#cases">Tested Cases</a>
        <a href="#discover">Explore podcast</a>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Statement (GSAP: scroll-scrubbed word reveal)                       */
/* ------------------------------------------------------------------ */
function Statement() {
  const ref = useRef(null);

  const tokens = STATEMENT.flatMap(({ t, em }) =>
    t
      .split(/(\s+)/)
      .filter(Boolean)
      .map((s) => ({ s, em }))
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".statement__word.is-soft",
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            duration: 0.5,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 75%",
              end: "bottom 55%",
              scrub: 0.6,
            },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="statement" id="discover" ref={ref}>
      <p className="statement__label">Discover stories that speak to you</p>
      <p className="statement__text">
        {tokens.map((k, i) =>
          /^\s+$/.test(k.s) ? (
            k.s
          ) : (
            <span key={i} className={`statement__word ${k.em ? "is-em" : "is-soft"}`}>
              {k.s}
            </span>
          )
        )}
      </p>
    </section>
  );
}

function ScrollRevealTitle({ children, className = "" }) {
  const ref = useRef(null);
  const words = children.split(/(\s+)/).filter(Boolean);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".scroll-reveal-title__word",
          { opacity: 0, yPercent: 55 },
          {
            opacity: 1,
            yPercent: 0,
            ease: "none",
            stagger: 0.14,
            duration: 0.65,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <h2 className={`section__title ${className}`} ref={ref}>
      {words.map((word, index) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <span className="scroll-reveal-title__word" key={`${word}-${index}`}>
            {word}
          </span>
        )
      )}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* Full size image (GSAP: frame expands to full bleed on scroll)       */
/* ------------------------------------------------------------------ */
function Feature() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scrollTrigger = {
          trigger: ref.current,
          start: "top 85%",
          end: "top 5%",
          scrub: true,
        };
        gsap.fromTo(
          ".feature__frame",
          { clipPath: "inset(12% 12% 12% 12% round 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger }
        );
        gsap.fromTo(".feature__img", { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="feature" id="podcast-structure" ref={ref} aria-label="Inside the studio">
      <div className="feature__frame">
        <Img
          className="feature__img"
          src="/podcast.png"
          seed={IMG.studio.seed}
          w={2400}
          h={1400}
          alt="Podcast studio with two microphones facing each other"
        />
        <div className="feature__shade" />
        <div className="feature__caption">
          <h2>Recorded in one take. No script, no rush.</h2>
          <p>
            Two chairs, two mics, and enough time for the answer behind the answer.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About + guests                                                      */
/* ------------------------------------------------------------------ */
function About() {
  return (
    <section className="section" id="guests">
      <div className="about__intro">
        <h2 className="section__title">
          A show for people who build things, and the people who follow along.
        </h2>
        <div className="about__side">
          <p className="lede">
            {SHOW.name} producting long-form podcast with business owners.
            Every guest gets a real conversation, a polished episode, and clips that keep working
            long after the recording.
          </p>
          <div className="host">
            <Img src="/Vronix_Logo.jpeg" seed={IMG.host.seed} w={400} h={400} alt={SHOW.host} />
            <div>
              <strong>{SHOW.host}</strong>
              <span>{SHOW.hostRole}</span>
            </div>
          </div>
        </div>
      </div>

      

      <div className="audience audience--single">
        <article className="panel panel--dark">
          <h3 className="panel__title">Business owners</h3>
          <p className="panel__copy">
            Tell the story behind the company: the first sale, the bad hire, the pivot. We record it
            long-form, then cut it into clips your customers will actually watch.
          </p>
          <ul className="panel__list">
            <li>Full episode on our channels, linked to your business</li>
            <li>Vertical clips ready for Instagram, LinkedIn, and Shorts</li>
            <li>Show notes with your offer, links, and contact</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Case studies                                                        */
/* ------------------------------------------------------------------ */
function ImageCarousel() {
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const images = useMemo(() => [...TESTED_IMAGES, ...TESTED_IMAGES.slice(0, 3)], []);

  useLayoutEffect(() => {
    const carousel = carouselRef.current;
    const track = trackRef.current;
    if (!carousel || !track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      let tween;
      const start = () => {
        tween?.kill();
        gsap.set(track, { x: 0 });
        const firstDuplicate = track.children[TESTED_IMAGES.length];
        const distance = firstDuplicate?.offsetLeft ?? 0;
        const isMobile = window.matchMedia("(max-width: 760px)").matches;
        if (distance) {
          tween = gsap.to(track, {
            x: -distance,
            duration: distance / (isMobile ? 32 : 50),
            ease: "none",
            repeat: -1,
          });
        }
      };

      start();
      const resizeObserver = new ResizeObserver(start);
      resizeObserver.observe(carousel);
      return () => resizeObserver.disconnect();
    }, carousel);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={carouselRef}
      className="carousel-container"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div ref={trackRef} className="carousel-track">
        {images.map((src, index) => (
          <motion.div
            className="carousel-item"
            key={`${src}-${index}`}
            aria-hidden={index >= TESTED_IMAGES.length || undefined}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(index, TESTED_IMAGES.length - 1) * 0.1, duration: 0.35 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={src}
              alt={index < TESTED_IMAGES.length ? `Podcast studio case study ${index + 1}` : ""}
              loading="lazy"
              onError={(event) => event.currentTarget.parentElement?.classList.add("carousel-item--missing")}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CaseStudies() {
  return (
    <section className="section cases" id="cases">
      <div className="cases__head">
        <ScrollRevealTitle className="cases__title">
          Tested case studies
        </ScrollRevealTitle>
        <p className="lede" style={{ maxWidth: "26em" }}>
          Real numbers from guests who’ve already recorded with us.
        </p>
      </div>

      <div className="cases__grid">
        {CASE_STUDIES.map((c) => (
          <article className="case" key={c.name}>
            <h3 className="case__name">{c.name}</h3>
            <p className="case__role">{c.role}</p>
            <div className="case__stats">
              <div className="case__stat">
                <span>{c.views}</span>
                <label>Views</label>
              </div>
              <div className="case__stat">
                <span>{c.ProfileVisits}</span>
                <label>Profile Visits</label>
              </div>
              <div className="case__stat">
                <span>{c.followers}</span>
                <label>Followers gained</label>
              </div>
              <div className="case__stat">
                <span>{c.performance}</span>
                <label>Performance</label>
              </div>
            </div>
            <div className="case__sales">
              <label>Sales impact</label>
              <span>{c.sales}</span>
            </div>
          </article>
        ))}
      </div>

      <ImageCarousel />

      <div className="cases__deliver">
        <h3 className="cases__deliver-title">What we deliver, every booking</h3>
        <ul className="cases__deliver-list">
          {DELIVERABLES.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Slot picker (demo availability calendar)                            */
/* ------------------------------------------------------------------ */
function isoOf(d) {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
}

function daysAhead(count) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  let d = new Date(today);
  while (days.length < count) {
    d = new Date(d);
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) days.push(new Date(d)); // studio closed on Sundays
  }
  return days;
}

// Deterministic pseudo-availability so the demo looks realistic without a backend.
// Replace slotsFor() with a real lookup once you connect a calendar/booking API.
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function slotsFor(iso, isPriorityDate = false) {
  if (isPriorityDate) {
    return SLOT_TIMES.map((time) => ({ time, booked: false }));
  }

  if (new Date(`${iso}T00:00:00`).getDate() === 29) {
    return SLOT_TIMES.map((time, index) => ({ time, booked: index === 2 }));
  }

  const h = hashString(iso);
  return SLOT_TIMES.map((time, i) => ({ time, booked: ((h >> (i * 2)) & 3) === 0 }));
}

function formatDay(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function SlotPicker({ date, slot, onChange }) {
  const days = useMemo(() => daysAhead(21), []);
  const selectedDayIndex = days.findIndex((day) => isoOf(day) === date);
  const activeSlots = date && selectedDayIndex >= 3 ? slotsFor(date) : [];

  return (
    <div className="slotpicker">
      <p className="slotpicker__label">Pick a day</p>
      <div className="slotpicker__days">
        {days.map((d, index) => {
          const iso = isoOf(d);
          const selected = iso === date;
          const unavailable = index < 3;
          return (
            <button
              type="button"
              key={iso}
              className={`slotpicker__day${selected ? " is-selected" : ""}${unavailable ? " is-unavailable" : ""}`}
              disabled={unavailable}
              aria-label={`${formatDay(iso)}${unavailable ? ", unavailable" : ", available"}`}
              onClick={() => onChange(iso, "")}
            >
              <span className="slotpicker__day-name">
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="slotpicker__day-num">{d.getDate()}</span>
              {unavailable && <span className="slotpicker__day-tag">Book</span>}
            </button>
          );
        })}
      </div>

      {date && (
        <>
          <p className="slotpicker__label">Pick a time</p>
          <div className="slotpicker__slots">
            {activeSlots.map((s) => (
              <button
                type="button"
                key={s.time}
                disabled={s.booked}
                className={`slotpicker__slot${slot === s.time ? " is-selected" : ""}`}
                onClick={() => onChange(date, s.time)}
              >
                {s.time}
                {s.booked && <span className="slotpicker__slot-tag">Booked</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Booking + payment                                                   */
/* ------------------------------------------------------------------ */
const GOOGLE_SHEET_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwrSbdME2Td5gUdltEaeoXw8M6ShBMbWz9BCQsKJvcXVRUC4_VHzNW33JX9UfRHaZ5D/exec";

async function sendToSheet(payload) {
  try {
    await fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Sheet logging is best-effort and must never interrupt a booking.
    console.error("Could not send booking to Google Sheet:", error);
  }
}

function Booking() {
  const [pkgId, setPkgId] = useState("signature");
  const [status, setStatus] = useState("idle"); // idle | pending
  const [payOpen, setPayOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", guest: "Business owner", date: "", slot: "" });
  const pkg = PACKAGES.find((p) => p.id === pkgId);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const updateSlot = (date, slot) => setForm((f) => ({ ...f, date, slot }));

  const canPay = form.name && form.phone && form.date && form.slot;

  // The browser has already validated name/phone; date and slot are checked here
  // since the calendar isn't a native form control.
  const handlePay = (e) => {
    e.preventDefault();
    if (!canPay) return;
    setPayOpen(true);
  };

  return (
    <section className="book" id="book">
      <div className="book__head">
        <h2 className="section__title">Book a podcast with us</h2>
        <p className="lede">
          Choose a package, pick a date, and pay online. We confirm your slot within 24 hours.
        </p>
      </div>

      <div className="book__grid">
        <div className="pkgs" role="radiogroup" aria-label="Choose a package">
          {PACKAGES.map((p) => {
            const selected = p.id === pkgId;
            return (
              <motion.button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className="pkg"
                onClick={() => setPkgId(p.id)}
                whileTap={{ scale: 0.99 }}
              >
                {selected && (
                  <motion.span
                    layoutId="pkg-highlight"
                    className="pkg__hl"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="pkg__name">{p.name}</span>
                <span className="pkg__price">{money(p.price)}</span>
                <p className="pkg__meta">{p.meta}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="checkout">
          <AnimatePresence mode="wait" initial={false}>
            {status === "pending" ? (
              <motion.div
                key="pending"
                className="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <motion.div
                  className="success__mark"
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <motion.path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.15, duration: 0.5 }}
                    />
                  </svg>
                </motion.div>
                <h3>Request sent, {form.name.split(" ")[0] || "friend"}.</h3>
                <p>
                  We’ll check your {money(pkg.price)} payment for {formatDay(form.date)} at {form.slot},
                  and confirm on WhatsApp or at {form.email || "your email"} within 24 hours.
                </p>
                <button type="button" className="btn btn--ghost" onClick={() => setStatus("idle")}>
                  Book another session
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handlePay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <h3>Your details</h3>
                <p className="checkout__sub">Takes about a minute.</p>

                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" required value={form.name} onChange={update("name")} autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" value={form.email} onChange={update("email")} autoComplete="email" />
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone number</label>
                  <input id="phone" type="tel" required value={form.phone} onChange={update("phone")} autoComplete="tel" />
                </div>
                <div className="field">
                  <label htmlFor="guest">I’m joining as</label>
                  <select id="guest" value={form.guest} onChange={update("guest")}>
                    <option>Business owner</option>
                  </select>
                </div>
                <div className="field field--slot">
                  <label>Preferred date and time</label>
                  <SlotPicker date={form.date} slot={form.slot} onChange={updateSlot} />
                </div>

                <div className="summary">
                  <div className="summary__row">
                    <span>{pkg.name}</span>
                    <span>{money(pkg.price)}</span>
                  </div>
                  <div className="summary__row">
                    <span>Session</span>
                    <span>{form.date ? `${formatDay(form.date)} · ${form.slot || "pick a time"}` : "Pick a day"}</span>
                  </div>
                  <div className="summary__row">
                    <span>Booking fee</span>
                    <span>₹0</span>
                  </div>
                  <div className="summary__row summary__row--total">
                    <span>Total</span>
                    <motion.span key={pkg.id} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                      {money(pkg.price)}
                    </motion.span>
                  </div>
                </div>

                <div className="checkout__value">
                  <strong>Why ₹10,000?</strong>
                  <p>
                    The podcast conversation is free. This payment covers post-production:
                    editing, all seven reels, and at least three reels built for viral-reach potential.
                  </p>
                </div>

                <motion.button
                  className="btn"
                  type="submit"
                  disabled={!canPay}
                  whileHover={{ scale: canPay ? 1.015 : 1 }}
                  whileTap={{ scale: canPay ? 0.98 : 1 }}
                >
                  {form.date && !form.slot
                    ? "Pick a time to continue"
                    : !form.date
                    ? "Pick a day to continue"
                    : `Pay ${money(pkg.price)} and book`}
                </motion.button>
                <p className="checkout__note">Pay with any UPI app. Free rescheduling up to 48 hours before.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {payOpen && (
        <PaymentModal
          amount={pkg.price}
          packageName={pkg.name}
          details={form}
          sessionLabel={`${formatDay(form.date)} at ${form.slot}`}
          onClose={() => setPayOpen(false)}
          onSent={() => {
            sendToSheet({
              name: form.name,
              phone: form.phone,
              email: form.email,
              guest: form.guest,
              pkgName: pkg.name,
              price: pkg.price,
              date: form.date,
              slot: form.slot,
            });
            setPayOpen(false);
            setStatus("pending");
          }}
        />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */
function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq">
      <ScrollRevealTitle className="faq__title">
        Before you book
      </ScrollRevealTitle>
      <div className="faq__list">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <div className="faq__item" key={item.q}>
              <button
                type="button"
                className="faq__q"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{item.q}</span>
                <motion.span
                  className="faq__icon"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  aria-hidden="true"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="faq__a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="footer">
      <p className="footer__big">
        YOUR STORY.
        <br />
        ON AIR.
      </p>
      <div className="footer__row">
        <span>© 2026 {SHOW.name}</span>
        <nav aria-label="Footer">
          <a href="https://www.instagram.com/vronixdigital/">Instagram</a>
          <a href="https://www.youtube.com/@VronixDigital">YouTube</a>
          <a href="https://open.spotify.com/user/31fmril63lddctz2exvrwybbwwxi">Spotify</a>
        </nav>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */
export default function App() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <Hero />
      <main>
        <Statement />
        <Feature />
        <About />
        <CaseStudies />
        <Booking />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
// https://script.google.com/macros/s/AKfycbwrSbdME2Td5gUdltEaeoXw8M6ShBMbWz9BCQsKJvcXVRUC4_VHzNW33JX9UfRHaZ5D/exec
