"use client";

import { useEffect, useId, useRef, useState } from "react";

const services = [
  { name: "Social media management", short: "Social presence", icon: "social", headline: "Your brand, showing up as it should.", description: "Give your pages a consistent voice and a considered visual direction. We shape the content around your business, your audience, and what you want to say.", deliverables: ["Content direction & planning", "Social graphics & captions", "Publishing rhythm", "Page presentation & consistency"], tags: ["CONTENT CALENDARS", "BRAND VOICE", "CONSISTENCY"] },
  { name: "Reels & content creation", short: "Reels & creative", icon: "reels", headline: "A strong first second. A story worth staying for.", description: "Bring your business to life with short content made for the way people watch. From the opening hook to the final frame, every detail has a purpose.", deliverables: ["Creative concepts & hooks", "Short-form storyboards", "Video editing & pacing", "Social-ready content formats"], tags: ["REELS", "STORYTELLING", "SHORT-FORM"] },
  { name: "Online business presence", short: "Brand presence", icon: "brand", headline: "Recognizable, wherever people find you.", description: "Connect the dots between your message, your visuals, and your pages. Build a brand presence that feels considered from the first look to the next conversation.", deliverables: ["Profile & page direction", "Visual consistency", "Brand messaging", "Online touchpoint review"], tags: ["IDENTITY", "MESSAGING", "FIRST IMPRESSIONS"] },
  { name: "Strategy & page growth", short: "Strategy & growth", icon: "growth", headline: "A clear plan. Room to keep getting better.", description: "Start with your goals, understand your audience, and give your content a direction. Review what connects and use those insights to shape the next cycle.", deliverables: ["Audience & content direction", "Campaign planning", "Content performance review", "Recommendations for the next cycle"], tags: ["DIRECTION", "INSIGHTS", "PAGE GROWTH"] },
];

const concepts = [
  { type: "Social", name: "A fresh take on flavour.", category: "Food & lifestyle / Social direction", className: "concept-citrus", subtitle: "A LITTLE ZEST.", title: <>A lot of<br />flavour.</>, mark: "ZEST", note: "Fresh ideas. Served daily." },
  { type: "Brand", name: "Made to stand apart.", category: "Fashion & culture / Brand presence", className: "concept-studio", subtitle: "INDIVIDUAL BY DESIGN", title: <>Wear your<br /><em>own world.</em></>, mark: "FORME", note: "For the ones who do it their way." },
  { type: "Motion", name: "A brand with momentum.", category: "Xach Media / Motion direction", className: "concept-xach", subtitle: "IDEAS DON'T STAND STILL.", title: <>Neither<br />do we.</>, mark: "XACH", note: "Strategy. Creativity. Presence." },
];

const faqs = [
  ["What can Xach Media help my business with?", "We focus on social media management, reels and content creation, online business presence, and page growth. We’ll discuss the mix of support that makes sense for your business."],
  ["Can I start with one service?", "Yes. Tell us what you need help with, whether it is reels, a more consistent page, or a clearer content direction. We can discuss a focused scope from there."],
  ["How do you put together a proposal?", "We start with your business, your goals, and your current online presence. The proposed scope, deliverables, schedule, and cost are discussed before work begins."],
  ["What should I share to get started?", "Your business name, a link to your current page if you have one, and what you would like to improve. Existing brand assets and examples you like are helpful too."],
  ["How is progress reviewed?", "The review approach is agreed as part of the scope. We look at relevant content insights, what the audience responds to, and what to refine in the next cycle."],
];

function Icon({ name, size = 24, ...props }) {
  const paths = {
    social: <><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.5" /><path d="M17 7h.01" /></>,
    reels: <><rect x="5" y="3" width="14" height="18" rx="3" /><path d="m10 9 5 3-5 3V9ZM5 7h14M9 3l2 4m3-4 2 4" /></>,
    brand: <><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5" /></>,
    growth: <><path d="M4 20h16M6 16v-4m6 4V8m6 8V4" /><circle cx="6" cy="9" r="1" /><circle cx="12" cy="5" r="1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
    phone: <path d="M8 3H5a2 2 0 0 0-2 2c0 9 7 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 2a13 13 0 0 1-6-6l2-2-2-5Z" />,
    chat: <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-9.5a9 9 0 0 1 18 0ZM7 11h10M7 15h6" />,
    pause: <path d="M8 5v14M16 5v14" />,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V3H3v13h5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.brand}</svg>;
}

function Star({ className = "" }) {
  return <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="m50 0 9 32 26-17-17 26 32 9-32 9 17 26-26-17-9 32-9-32-26 17 17-26L0 50l32-9-17-26 26 17Z" /></svg>;
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <article className={`faq-item${open ? " is-open" : ""}`}>
    <h3><button id={`${id}-question`} aria-expanded={open} aria-controls={`${id}-answer`} onClick={() => setOpen(!open)}>{question}<Icon name="plus" size={20} /></button></h3>
    <div className="faq-answer" id={`${id}-answer`} role="region" aria-labelledby={`${id}-question`} aria-hidden={!open}><div><p>{answer}</p></div></div>
  </article>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [conceptFilter, setConceptFilter] = useState("All concepts");
  const [motionPaused, setMotionPaused] = useState(false);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const [compactNavigation, setCompactNavigation] = useState(false);
  const [compactServices, setCompactServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [brief, setBrief] = useState(null);
  const [briefPayload, setBriefPayload] = useState(null);
  const [sendState, setSendState] = useState({ status: "idle", message: "" });
  const [copyState, setCopyState] = useState("");
  const [year, setYear] = useState(2026);
  const sceneRef = useRef(null);
  const progressRef = useRef(null);
  const menuButtonRef = useRef(null);
  const briefPreviewRef = useRef(null);
  const siteRef = useRef(null);
  const pointerFrameRef = useRef(0);
  const motionObserverRef = useRef(null);
  const quickContactRef = useRef(null);
  const sendAttemptRef = useRef(0);
  const sendingSubmissionRef = useRef(null);

  useEffect(() => {
    if (brief) briefPreviewRef.current?.focus({ preventScroll: false });
  }, [brief]);

  useEffect(() => {
    setYear(new Date().getFullYear());
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => { setMotionPaused(preference.matches); setSystemReducedMotion(preference.matches); };
    syncPreference();
    preference.addEventListener("change", syncPreference);
    const navigationQuery = window.matchMedia("(max-width: 900px)");
    const serviceQuery = window.matchMedia("(max-width: 650px)");
    const syncScreen = () => { setCompactNavigation(navigationQuery.matches); setCompactServices(serviceQuery.matches); };
    syncScreen();
    navigationQuery.addEventListener("change", syncScreen);
    serviceQuery.addEventListener("change", syncScreen);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(element => { element.classList.add("reveal-ready"); observer.observe(element); });
    const motionObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle("motion-offscreen", !entry.isIntersecting)), { rootMargin: "140px 0px" });
    motionObserverRef.current = motionObserver;
    document.querySelectorAll("[data-motion-region]").forEach(element => motionObserver.observe(element));
    const syncVisibility = () => siteRef.current?.classList.toggle("page-inactive", document.hidden);
    document.addEventListener("visibilitychange", syncVisibility);
    syncVisibility();
    let pending = 0;
    const heroSection = document.getElementById("home");
    const contactSection = document.getElementById("contact");
    const updateProgress = () => {
      if (pending) return;
      pending = window.requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
        const pastHero = heroSection && heroSection.getBoundingClientRect().bottom < 80;
        const beforeContact = contactSection && contactSection.getBoundingClientRect().top > window.innerHeight + 80;
        quickContactRef.current?.classList.toggle("is-visible", Boolean(pastHero && beforeContact));
        pending = 0;
      });
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => { observer.disconnect(); motionObserver.disconnect(); preference.removeEventListener("change", syncPreference); navigationQuery.removeEventListener("change", syncScreen); serviceQuery.removeEventListener("change", syncScreen); document.removeEventListener("visibilitychange", syncVisibility); window.removeEventListener("scroll", updateProgress); window.cancelAnimationFrame(pending); window.cancelAnimationFrame(pointerFrameRef.current); };
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(".concept-card[data-motion-region]");
    cards.forEach(card => motionObserverRef.current?.observe(card));
    return () => cards.forEach(card => motionObserverRef.current?.unobserve(card));
  }, [conceptFilter]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = event => { if (event.key === "Escape") { setMenuOpen(false); menuButtonRef.current?.focus(); } };
    const closeOnResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    const closeOutside = event => { if (!event.target.closest(".site-header")) setMenuOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    window.addEventListener("resize", closeOnResize);
    return () => { document.removeEventListener("keydown", closeOnEscape); document.removeEventListener("pointerdown", closeOutside); window.removeEventListener("resize", closeOnResize); };
  }, [menuOpen]);

  const clearPreparedBrief = () => {
    sendAttemptRef.current += 1;
    setBrief(null);
    setBriefPayload(null);
    setSendState({ status: "idle", message: "" });
  };
  const chooseService = name => { setSelectedServices(current => current.includes(name) ? current : [...current, name]); clearPreparedBrief(); };
  const moveScene = event => {
    if (motionPaused || event.pointerType === "touch") return;
    const box = event.currentTarget.getBoundingClientRect();
    const rx = ((event.clientY - box.top) / box.height - .5) * -6;
    const ry = ((event.clientX - box.left) / box.width - .5) * 9;
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => { sceneRef.current?.style.setProperty("--rx", `${rx}deg`); sceneRef.current?.style.setProperty("--ry", `${ry}deg`); });
  };
  const resetScene = () => { window.cancelAnimationFrame(pointerFrameRef.current); sceneRef.current?.style.setProperty("--rx", "0deg"); sceneRef.current?.style.setProperty("--ry", "0deg"); };
  const prepareBrief = event => {
    event.preventDefault();
    if (sendState.status === "sending") return;
    for (const field of ["name", "business", "goal"]) {
      const input = event.currentTarget.elements.namedItem(field);
      if (!input.value.trim()) {
        input.setCustomValidity("Please add a little more than spaces.");
        input.reportValidity();
        return;
      }
    }
    const data = new FormData(event.currentTarget);
    sendAttemptRef.current += 1;
    setBriefPayload({
      name: data.get("name").trim(), business: data.get("business").trim(), email: data.get("email").trim(),
      services: [...selectedServices], page: data.get("page").trim(), goal: data.get("goal").trim(),
      company_url: String(data.get("company_url") || ""),
      submissionId: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`,
    });
    setSendState({ status: "idle", message: "" });
    const text = `Hi Xach Media, I’d like to discuss a project.\n\nName: ${data.get("name").trim()}\nBusiness: ${data.get("business").trim()}\nEmail: ${data.get("email").trim()}\nInterested in: ${selectedServices.length ? selectedServices.join(", ") : "Help choosing the right service"}\nCurrent page: ${data.get("page").trim() || "Not shared"}\n\nMy goal:\n${data.get("goal").trim()}`;
    setBrief(text); setCopyState("");
  };
  const copyBrief = async () => {
    try { await navigator.clipboard.writeText(brief); setCopyState("Brief copied."); }
    catch { setCopyState("Select and copy the text above to share your brief."); }
  };
  const sendBrief = async () => {
    if (!briefPayload || sendState.status === "sending" || sendState.status === "sent" || sendingSubmissionRef.current === briefPayload.submissionId) return;
    const attempt = ++sendAttemptRef.current;
    const submissionId = briefPayload.submissionId;
    sendingSubmissionRef.current = submissionId;
    setSendState({ status: "sending", message: "Sending your enquiry to Xach Media…" });
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(briefPayload), signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (attempt !== sendAttemptRef.current) return;
      if (!response.ok || result?.success !== true) {
        setSendState({ status: "error", message: typeof result?.error === "string" ? result.error : "We couldn’t send your enquiry. Please try again, or use WhatsApp or the email draft below." });
        return;
      }
      setSendState({ status: "sent", message: "Your enquiry has been sent to Xach Media. Thank you for getting in touch." });
    } catch {
      if (attempt === sendAttemptRef.current) setSendState({ status: "error", message: "We couldn’t confirm your email was sent. Please retry, or use WhatsApp or the email draft below. Your brief is still here." });
    } finally {
      window.clearTimeout(timeout);
      if (sendingSubmissionRef.current === submissionId) sendingSubmissionRef.current = null;
    }
  };

  return <div ref={siteRef} className={`agency-site${motionPaused ? " motion-paused" : ""}${menuOpen ? " menu-open" : ""}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="container header-inner">
      <a className="wordmark" href="#home" aria-label="Xach Media home"><span className="logo-crop"><img src="/xach-purple-logo.png" alt="" width="52" height="52" /></span><span>Xach<span className="wordmark-media">media</span></span></a>
      <button className="menu-toggle" ref={menuButtonRef} aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      <nav className={`main-nav${menuOpen ? " is-open" : ""}`} id="main-navigation" aria-label="Main navigation" inert={compactNavigation && !menuOpen ? true : undefined}>
        {[['Creative ideas', '#creative'], ['Services', '#services'], ['About Xach', '#studio']].map(([name, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{name}</a>)}
        <a className="button button-small" href="#contact" onClick={() => setMenuOpen(false)}>Start a project</a>
      </nav>
    </div><div className="scroll-progress" ref={progressRef} aria-hidden="true" /></header>
    <div className={`navigation-shade${menuOpen ? " is-open" : ""}`} aria-hidden="true" onClick={() => setMenuOpen(false)} />

    <main id="main">
      <section className="hero" id="home" data-motion-region><div className="container">
        <div className="hero-topline"><span className="eyebrow">DIGITAL MARKETING & CREATIVE AGENCY</span><span className="hero-top-note">Built on ideas. Driven by your next chapter.</span></div>
        <div className="hero-grid">
          <div className="hero-copy"><h1>Be seen.<br /><span>Be remembered.</span></h1><p>Social media, standout reels, and a sharper online presence for the business you’re building.</p><div className="hero-actions"><a className="button" href="#contact">Start your project</a><a className="text-link" href="#creative">Explore the creative</a></div><div className="hero-signature"><span className="signature-line" /><span>STRATEGY MEETS A LITTLE<br /><strong>CREATIVE OBSESSION.</strong></span></div></div>
          <div className="hero-scene" onPointerMove={moveScene} onPointerLeave={resetScene} aria-label="Xach Media brand in motion">
            <div className="scene-grid" aria-hidden="true" /><div className="scene-glow" aria-hidden="true" />
            <div className="scene-object" ref={sceneRef}><div className="orbital-ring ring-one" /><div className="orbital-ring ring-two" /><div className="brand-disc"><div className="disc-edge" /><img src="/xach-purple-logo.png" alt="Xach Media purple metallic emblem" width="400" height="400" fetchPriority="high" /><div className="disc-sheen" /></div><div className="scene-satellite satellite-one"><Star /></div><div className="scene-satellite satellite-two" /></div>
            <div className="scene-note scene-note-top"><span className="tiny-icon"><Icon name="social" size={19} /></span><div>Ideas with direction.<small>CONTENT THAT FEELS LIKE YOU</small></div></div>
            <div className="scene-note scene-note-bottom"><span className="waveform" aria-hidden="true">{Array.from({length: 12}, (_, i) => <i key={i} />)}</span><div>Your story. In motion.<small>REELS & CREATIVE</small></div></div>
            <div className="scene-caption"><span>THE XACH PERSPECTIVE</span><button className="motion-control" aria-pressed={motionPaused} disabled={systemReducedMotion} onClick={() => setMotionPaused(!motionPaused)}><Icon name={motionPaused ? "play" : "pause"} size={14} />{systemReducedMotion ? "Reduced motion" : motionPaused ? "Resume motion" : "Pause motion"}</button></div>
          </div>
        </div>
        <div className="hero-bottom"><span>A clear voice. A consistent presence. A brand people recognize.</span><a href="#services">Discover what we do</a></div>
      </div></section>
      <div className="marquee" data-motion-region aria-label="Strategy, social media, reels, brand presence"><div className="marquee-track">{[0,1].map(group => <div className="marquee-group" key={group} aria-hidden={group === 1 ? true : undefined}>{["Ideas that connect", "Content with character", "Presence with purpose"].map(word => <span key={word}><Star />{word}</span>)}</div>)}</div></div>

      <section className="creative-section section" id="creative"><div className="container">
        <div className="section-heading" data-reveal><div><span className="eyebrow">A TASTE OF THE CREATIVE</span><h2>Big ideas.<br /><span>Distinctly expressed.</span></h2></div><p>A feeling, a story, a reason to stop scrolling. Explore the possibilities when your brand has a point of view.</p></div>
        <div className="creative-toolbar"><span className="concept-label">STUDIO CONCEPTS</span><div className="filter-group" aria-label="Filter studio concepts">{["All concepts", "Social", "Brand", "Motion"].map(filter => <button key={filter} aria-pressed={conceptFilter === filter} className={conceptFilter === filter ? "is-selected" : ""} onClick={() => setConceptFilter(filter)}>{filter}</button>)}</div></div>
        {conceptFilter === "All concepts" && <p className="gallery-hint">Swipe to explore the concepts</p>}
        <div className={`concept-grid${conceptFilter !== "All concepts" ? " is-filtered" : ""}`} role="region" aria-label="Studio concept gallery" tabIndex={compactServices && conceptFilter === "All concepts" ? 0 : undefined} aria-live="polite">{concepts.filter(concept => conceptFilter === "All concepts" || concept.type === conceptFilter).map(concept => <article className="concept-card" key={concept.name} data-motion-region>
          <div className={`concept-art ${concept.className}`}><div className="concept-art-header"><strong>{concept.mark}</strong><span>STUDIO<br />CONCEPT</span></div><div className="concept-graphic" aria-hidden="true">{concept.type === "Social" ? <><div className="citrus-leaf" /><div className="citrus-fruit" /><div className="citrus-slice" /></> : concept.type === "Brand" ? <><div className="chrome-orb" /><div className="chrome-orbit" /><div className="poster-grid" /></> : <><div className="motion-ribbon ribbon-a" /><div className="motion-ribbon ribbon-b" /><Star className="poster-star" /></>}</div><div className="concept-art-copy"><span>{concept.subtitle}</span><h3>{concept.title}</h3></div><div className="concept-art-footer"><span>{concept.note}</span><span className="concept-symbol">✳</span></div></div>
          <div className="concept-description"><span>{concept.category}</span><h3>{concept.name}</h3></div>
        </article>)}</div>
        <p className="concept-disclaimer">Original studio concepts to demonstrate creative direction. These are illustrative examples, rather than client case studies.</p>
      </div></section>

      <section className="services-section section" id="services"><div className="container">
        <div className="section-heading" data-reveal><div><span className="eyebrow">WHAT WE BRING TO THE TABLE</span><h2>One creative partner.<br /><span>A connected presence.</span></h2></div><p>Start where your business needs us. Build a plan that connects your story, your content, and your next move.</p></div>
        <div className="expertise-layout" data-reveal><div className="service-tabs" role="tablist" aria-label="Agency expertise" aria-orientation={compactServices ? "horizontal" : "vertical"}>{services.map((service,index) => <button key={service.name} id={`service-tab-${index}`} role="tab" aria-selected={activeService === index} aria-controls={`service-panel-${index}`} tabIndex={activeService === index ? 0 : -1} className={activeService === index ? "is-active" : ""} onClick={() => setActiveService(index)} onKeyDown={event => { let next; if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % services.length; else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + services.length - 1) % services.length; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = services.length - 1; if (next !== undefined) { event.preventDefault(); setActiveService(next); document.getElementById(`service-tab-${next}`)?.focus(); } }}><Icon name={service.icon} /><span>{service.short}</span><span className="tab-indicator"><Icon name="plus" size={18} /></span></button>)}</div>
          {services.map((service,index) => <div className="service-panel" role="tabpanel" id={`service-panel-${index}`} aria-labelledby={`service-tab-${index}`} hidden={activeService !== index} key={service.name} tabIndex={0}><div className="panel-top"><span className="eyebrow">{service.name}</span><Icon name={service.icon} size={38} /></div><h3>{service.headline}</h3><p>{service.description}</p><ul className="deliverables">{service.deliverables.map(item => <li key={item}><Icon name="check" size={17} />{item}</li>)}</ul><div className="service-panel-bottom"><div className="tag-list">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a className="text-link" href="#contact" onClick={() => chooseService(service.name)}>Let’s talk about {service.short.toLowerCase()}</a></div></div>)}
        </div><p className="scope-note">Every engagement starts with an agreed scope, deliverables, and a clear next step.</p>
      </div></section>

      <section className="manifesto" data-motion-region><div className="container manifesto-inner" data-reveal><Star /><span className="eyebrow">YOU HAVE A BUSINESS TO BUILD.</span><h2>We’ll make sure<br />it <span>looks the part.</span></h2><div className="manifesto-bottom"><p>Thoughtful strategy. Creative with personality.<br />The consistency your brand deserves.</p><a className="button button-dark" href="#contact">Find your next move</a></div></div></section>

      <section className="process-section section" id="process"><div className="container process-layout"><div className="process-intro" data-reveal><span className="eyebrow">FROM FIRST HELLO TO WHAT’S NEXT</span><h2>Good work.<br /><span>Clear process.</span></h2><p>You should know what we’re making, why we’re making it, and what happens next.</p><a className="text-link" href="#contact">Tell us what you have in mind</a><div className="process-doodle" data-motion-region aria-hidden="true"><span>YOUR BUSINESS</span><div><i /><Star /><i /></div><strong>OUR CREATIVE ENERGY</strong></div></div><div className="process-steps">{[
          { title: "First, we listen.", text: "Your business, your audience, your ambitions. We get to know what makes you different and where you want to go.", label: "DISCOVERY" },
          { title: "Then, a clear direction.", text: "We shape the creative approach and agree on the scope, content priorities, and working rhythm.", label: "DIRECTION" },
          { title: "Time to make it happen.", text: "Ideas become content, reels, and a consistent presence. We bring the plan to life with the agreed review process.", label: "CREATION" },
          { title: "Keep moving forward.", text: "We review what connects, gather the learning, and use it to guide the next round of creative.", label: "REFINEMENT" },
        ].map(step => <article className="process-step" key={step.label} data-reveal><div className="process-marker"><span /></div><div><span className="eyebrow">{step.label}</span><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></div></section>

      <section className="studio-section section" id="studio"><div className="container studio-layout"><div className="founder-visual" data-reveal data-motion-region><div className="founder-visual-top"><span>XACH MEDIA</span><Star /></div><div className="founder-art"><span className="founder-monogram">AHK<span>CREATIVE DIRECTION.<br />BUSINESS INTENTION.</span></span><div className="founder-orbit" /><div className="founder-orbit orbit-offset" /></div><div className="founder-name"><h3>Abdul Hadi Khan</h3><span>CEO, Xach Media</span></div><img className="founder-banner" src="/abdul-hadi-khan-banner.png" alt="Abdul Hadi Khan, CEO of Xach Media — official brand banner" width="2172" height="724" loading="lazy" /></div><div className="studio-copy" data-reveal><span className="eyebrow">THE STUDIO BEHIND THE SCROLL</span><h2>A little bold.<br /><span>Very intentional.</span></h2><p className="studio-lead">Xach Media is built around a simple idea: a business with something to offer deserves a presence that shows it.</p><p>Led by Abdul Hadi Khan, we bring social media, reels, and online brand presence together with a clear creative direction. We care about how your brand looks, what it says, and how consistently it shows up.</p><div className="studio-values"><span><Icon name="check" size={16} />Ideas shaped around your business</span><span><Icon name="check" size={16} />A clear scope from the start</span><span><Icon name="check" size={16} />Creative that feels like your brand</span></div><a className="text-link" href="#contact">Meet your next creative partner</a></div></div></section>

      <section className="faq-section section"><div className="container faq-layout"><div data-reveal><span className="eyebrow">A LITTLE CLARITY</span><h2>Good questions.<br /><span>Straight answers.</span></h2><p>Still have something on your mind?<br /><a href="mailto:info@xachmedia.com" className="text-link">Ask us directly</a></p></div><div className="faq-list">{faqs.map(([question, answer]) => <FaqItem key={question} question={question} answer={answer} />)}</div></div></section>

      <section className="contact-section section" id="contact"><div className="container"><div className="contact-head" data-reveal><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Got a vision?<br /><span>Let’s give it presence.</span><Star /></h2></div><div className="contact-layout"><div className="contact-intro"><h3>Start with a conversation.</h3><p>Tell us a little about your business and what you have in mind. We’ll use that as the starting point for a plan.</p><a className="contact-direct" href="mailto:info@xachmedia.com"><Icon name="mail" /><span><small>DROP US A LINE</small>info@xachmedia.com</span></a><a className="contact-direct" href="tel:+923453186700"><Icon name="phone" /><span><small>LET’S TALK</small>0345 3186700</span></a><a className="contact-whatsapp" href="https://wa.me/923453186700" target="_blank" rel="noopener noreferrer"><Icon name="chat" size={20} />Prefer WhatsApp? Start here</a><div className="brief-note"><span>THE FIRST STEP</span><p>A few details. One useful conversation.<br />A clearer idea of what’s next.</p></div></div>
          <div className="brief-card"><form onInput={event => event.target.setCustomValidity?.("")} onSubmit={prepareBrief} onChange={() => { if (brief) clearPreparedBrief(); }}><fieldset className="brief-fields" disabled={sendState.status === "sending"}><label className="contact-honeypot" aria-hidden="true">Leave this field empty<input name="company_url" type="text" autoComplete="off" tabIndex={-1} /></label><div className="form-title"><h3>Your project brief</h3><span>LET’S GET TO KNOW YOU</span></div><div className="form-fields"><label>Your name<input name="name" autoComplete="name" enterKeyHint="next" placeholder="What should we call you?" required maxLength={100} /></label><label>Business / brand<input name="business" autoComplete="organization" enterKeyHint="next" placeholder="Your business name" required maxLength={150} /></label><label className="full-field">Email address<input name="email" type="email" autoComplete="email" enterKeyHint="next" placeholder="you@yourbusiness.com" required maxLength={200} /></label></div><fieldset className="service-choices"><legend>What would you like help with?</legend><p className="service-choice-help">Choose any that apply. Unsure? You can leave this blank.</p><div>{services.map(service => <label className={selectedServices.includes(service.name) ? "is-checked" : ""} key={service.name}><input type="checkbox" name="services" value={service.name} checked={selectedServices.includes(service.name)} onChange={event => { setSelectedServices(current => event.target.checked ? [...current, service.name] : current.filter(value => value !== service.name)); clearPreparedBrief(); }} /><span><Icon name={selectedServices.includes(service.name) ? "check" : "plus"} size={14} />{service.short}</span></label>)}</div></fieldset><label className="form-label">Your page or website <span>(optional)</span><input name="page" type="text" inputMode="url" enterKeyHint="next" autoCapitalize="none" spellCheck={false} placeholder="instagram.com/yourbrand" maxLength={300} /></label><label className="form-label">What would you like to achieve?<textarea name="goal" rows={3} placeholder="A little about your business, your goals, or the idea you can’t stop thinking about…" required maxLength={3000} /></label><button type="submit" className="button brief-submit">Prepare my project brief</button><p className="form-help">Review your brief, then send it directly to Xach Media or share it on WhatsApp.</p></fieldset></form>
          {brief && <section className="brief-preview" ref={briefPreviewRef} tabIndex={-1} aria-label="Your prepared brief" aria-live="polite"><span className="eyebrow">READY WHEN YOU ARE</span><h3>Review your project brief.</h3><label className="sr-only" htmlFor="prepared-brief">Prepared project brief</label><textarea id="prepared-brief" value={brief} readOnly rows={9} /><button className="button direct-send-button" type="button" onClick={sendBrief} disabled={sendState.status === "sending" || sendState.status === "sent"} aria-describedby="email-send-status">{sendState.status === "sending" ? <span className="send-spinner" aria-hidden="true" /> : <Icon name={sendState.status === "sent" ? "check" : "mail"} size={19} />}{sendState.status === "sending" ? "Sending your brief…" : sendState.status === "sent" ? "Enquiry sent" : sendState.status === "error" ? "Try sending again" : "Send to Xach Media"}</button><p className={`email-send-status is-${sendState.status}`} id="email-send-status" role={sendState.status === "error" ? "alert" : "status"}>{sendState.message || "Ready? Send this brief to our team directly from the website."}</p><p className="brief-alternatives-label">Or share it another way</p><div className="brief-share"><a className="button button-outline" href={`https://wa.me/923453186700?text=${encodeURIComponent(brief)}`} target="_blank" rel="noopener noreferrer">Open in WhatsApp</a><a className="button button-outline" href={`mailto:info@xachmedia.com?subject=${encodeURIComponent("New project enquiry — Xach Media")}&body=${encodeURIComponent(brief)}`}>Open email draft</a><button className="copy-button" type="button" onClick={copyBrief}><Icon name="copy" size={17} />Copy brief</button></div><p role="status">{copyState || "Your chosen app opens with this draft. You send it when you’re ready."}</p></section>}
          </div>
        </div></div></section>
    </main>
    <nav className="mobile-contact-bar" ref={quickContactRef} aria-label="Quick contact"><a className="button" href="#contact">Start a project</a><a className="mobile-whatsapp" href="https://wa.me/923453186700" target="_blank" rel="noopener noreferrer"><Icon name="chat" size={19} />WhatsApp</a></nav>
    <footer className="site-footer" data-motion-region><div className="footer-atmosphere" aria-hidden="true"><div className="footer-orbit orbit-primary" /><div className="footer-orbit orbit-secondary" /><div className="footer-light" /></div><div className="container"><div className="footer-invitation" data-reveal><div><span className="eyebrow">GOOD IDEAS DESERVE GOOD COMPANY.</span><a href="mailto:info@xachmedia.com" className="footer-email">Say hello.<Icon name="mail" size={38} /></a></div><a href="#contact" className="footer-seal" aria-label="Start your project with Xach Media"><Star /><span>YOUR NEXT<br />CHAPTER</span></a></div><div className="footer-top"><a className="wordmark" href="#home" aria-label="Xach Media home"><span className="logo-crop"><img src="/xach-purple-logo.png" alt="" width="52" height="52" loading="lazy" /></span><span>Xach<span className="wordmark-media">media</span></span></a><p>Ideas with direction.<br />Presence with personality.</p><div><a href="#creative">Creative ideas</a><a href="#services">Services</a><a href="#contact">Let’s talk</a></div></div><div className="footer-bottom"><span>© {year} Xach Media. All rights reserved.</span><span>Led by Abdul Hadi Khan.</span><a href="#home">Back to the beginning</a></div><div className="footer-giant" aria-hidden="true"><span className="footer-line-one">LET’S MAKE<Star /></span><span className="footer-line-two">AN IMPRESSION.</span></div></div><div className="footer-ticker" aria-hidden="true"><div>{[0,1].map(i => <span key={i}>STAY SEEN. <b>STAY REMEMBERED.</b> <Star /> XACH MEDIA <Star /></span>)}</div></div></footer>
  </div>;
}
