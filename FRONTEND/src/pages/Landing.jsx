import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { categories } from "../data/mockData";
import useReveal from "../hooks/useReveal";
import useCountUp from "../hooks/useCountUp";

/* ---------------------------------- data --------------------------------- */

const STATS = [
  { target: 8, suffix: "", label: "Service Categories" },
  { target: 100, suffix: "%", label: "ID-Verified Professionals" },
  { target: 4.8, suffix: "★", label: "Average Pro Rating", decimals: 1 },
  { target: 60, suffix: "s", label: "To Send a Booking" },
];

const STEPS = [
  {
    icon: "🔍",
    title: "Search & Compare",
    desc: "Browse verified professionals by service and city. Compare ratings, hourly rates and experience — no phone-tag, no guesswork.",
  },
  {
    icon: "📅",
    title: "Book in Minutes",
    desc: "Pick a date and time that suits you and send a booking request. The professional confirms, and you both get a clear schedule.",
  },
  {
    icon: "✅",
    title: "Relax & Pay Securely",
    desc: "Your professional arrives on time and gets the job done. Pay through the platform once the work is complete.",
  },
];

const POPULAR_SERVICES = [
  { title: "Deep Cleaning", desc: "Full-home deep cleaning for kitchens, bathrooms and living spaces — sparkling results, every time.", icon: "🧹" },
  { title: "Daily Cooking", desc: "Experienced home cooks for daily meals, tiffins and family gatherings, tailored to your taste.", icon: "🍳" },
  { title: "Babysitting", desc: "Patient, background-verified caregivers your children will love and you can trust.", icon: "👶" },
  { title: "Plumbing", desc: "Leaks, fittings and full bathroom installations handled by reliable local plumbers.", icon: "🚰" },
  { title: "Electrical Repair", desc: "Certified electricians for wiring, repairs, and safe installations of every size.", icon: "⚡" },
  { title: "Pest Control", desc: "Licensed pest treatments with child- and pet-safe chemicals and a free re-service window.", icon: "🐜" },
];

const WHY_US = [
  {
    icon: "🛡️",
    title: "Aadhaar-Verified Pros",
    desc: "Every professional completes an identity check before accepting jobs. No strangers — only verified people in your home.",
  },
  {
    icon: "💸",
    title: "Upfront, Honest Pricing",
    desc: "Hourly rates are shown on every profile before you book. The price you see is the price you pay — no haggling, no surprises.",
  },
  {
    icon: "⭐",
    title: "Real Reviews & Ratings",
    desc: "Ratings come only from completed, paid bookings. What you read is what real customers in your city actually experienced.",
  },
  {
    icon: "🔁",
    title: "Easy Reschedule & Cancel",
    desc: "Plans change — we get it. Reschedule or cancel from your dashboard in a couple of taps, no phone calls needed.",
  },
];

// Sample showcase cards (illustrative — mirrors the seeded demo pros)
const TOP_WORKERS = [
  { name: "Kavita Patel", service: "Daily Cooking", city: "Mumbai", rating: 5.0, reviews: 64, rate: 400, exp: 10, initials: "KP" },
  { name: "Sunita Sharma", service: "Deep Cleaning", city: "Mumbai", rating: 4.9, reviews: 38, rate: 300, exp: 6, initials: "SS" },
  { name: "Ramesh Verma", service: "Plumbing", city: "Delhi", rating: 4.8, reviews: 52, rate: 350, exp: 8, initials: "RV" },
  { name: "Pooja Devi", service: "Babysitting", city: "Mumbai", rating: 4.9, reviews: 29, rate: 280, exp: 5, initials: "PD" },
];

const TESTIMONIALS = [
  {
    quote: "Booked a deep clean before Diwali and the house looked brand new. The professional was punctual, polite and thorough.",
    name: "Ananya Deshpande",
    meta: "Homeowner · Mumbai",
    initials: "AD",
  },
  {
    quote: "As a cook on HHC, I get regular bookings near my home and payments are never delayed. It changed how I find work.",
    name: "Kavita Patel",
    meta: "Home Cook · Ahmedabad",
    initials: "KP",
  },
  {
    quote: "Finding a trustworthy babysitter used to take weeks of asking around. On HHC it took one evening, with reviews I could actually read.",
    name: "Rohit Malhotra",
    meta: "Parent · Delhi",
    initials: "RM",
  },
];

const FAQS = [
  {
    q: "How are professionals verified?",
    a: "Every professional completes an identity check with a government ID (Aadhaar-based e-KYC) before they can accept bookings. Profiles also carry real ratings and review counts from completed jobs, so you can book with confidence.",
  },
  {
    q: "How does booking work?",
    a: "Search for a service, open a professional's profile, and send a booking request with your preferred date and time. The professional confirms the schedule, completes the job, and you pay through the platform.",
  },
  {
    q: "What does it cost to use House Help Connect?",
    a: "Browsing and booking are free for customers — you only pay the professional's hourly rate for the work you book. Professionals set their own rates, shown upfront on every profile.",
  },
  {
    q: "Can I work as a professional on HHC?",
    a: "Yes. Register as a worker, complete verification, set your services and hourly rate, and start receiving booking requests from customers in your city.",
  },
  {
    q: "What if I need to cancel or reschedule?",
    a: "You can cancel or propose a new date from your bookings dashboard. We recommend doing so as early as possible so the professional can offer the slot to someone else.",
  },
];

/* -------------------------------- components ------------------------------- */

/** Scroll-reveal wrapper — pair with the useReveal hook mounted in Landing. */
const Reveal = ({ children, className = "", delay = 0 }) => (
  <div className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` }}>
    {children}
  </div>
);

const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <Reveal className="mb-14 text-center">
    <p className="mb-3 text-sm font-bold tracking-widest uppercase text-accent-600">{eyebrow}</p>
    <h2 className="mb-4 text-3xl font-bold md:text-4xl text-ink-main">{title}</h2>
    {subtitle && <p className="max-w-2xl mx-auto text-lg text-ink-muted">{subtitle}</p>}
  </Reveal>
);

const StatItem = ({ stat, bordered }) => {
  const [ref, display] = useCountUp(stat.target, { decimals: stat.decimals || 0 });
  return (
    <div ref={ref} className={`flex flex-col items-center ${bordered ? "md:border-l md:border-surface-border" : ""}`}>
      <h3 className="mb-2 text-4xl font-extrabold md:text-5xl text-primary-600 tabular-nums">
        {display}{stat.suffix}
      </h3>
      <p className="text-xs font-bold tracking-wider uppercase md:text-sm text-ink-muted">{stat.label}</p>
    </div>
  );
};

const FaqItem = ({ faq, isOpen, onToggle }) => (
  <div className="overflow-hidden border bg-surface-card border-surface-border rounded-2xl shadow-soft">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex items-center justify-between w-full gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20"
    >
      <span className="text-base font-bold md:text-lg text-ink-main">{faq.q}</span>
      <span className={`flex items-center justify-center w-8 h-8 text-lg font-bold rounded-full shrink-0 transition-all duration-300 ${isOpen ? "bg-primary-600 text-white rotate-45" : "bg-primary-50 text-primary-700"}`}>
        +
      </span>
    </button>
    <div
      className="grid transition-all duration-300 ease-out"
      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
    >
      <div className="overflow-hidden">
        <p className="px-6 pb-6 leading-relaxed text-ink-muted">{faq.a}</p>
      </div>
    </div>
  </div>
);

/* ---------------------------------- page ----------------------------------- */

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(0);
  useReveal();

  // Support footer links like /#services
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 120);
        return () => clearTimeout(t);
      }
    }
    return undefined;
  }, [location.hash]);

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-sans bg-surface">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-surface to-surface">
        {/* animated glow blobs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[520px] bg-primary-200/50 rounded-full blur-3xl pointer-events-none animate-glow-pulse"></div>
        <div className="absolute top-40 -left-32 w-96 h-96 bg-accent-200/40 rounded-full blur-3xl pointer-events-none animate-glow-pulse" style={{ animationDelay: "1.6s" }}></div>

        <div className="relative z-10 px-6 pt-28 pb-16 mx-auto text-center lg:pt-36 lg:pb-24 max-w-7xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-bold rounded-full bg-accent-100 text-accent-700 border border-accent-200 animate-fade-in">
            🛡️ ID-verified professionals, on demand
          </span>

          <h1 className="flex flex-col gap-3 mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl text-ink-main animate-fade-in">
            <span>Connecting Homes with</span>
            <span className="pb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-700 via-primary-500 to-accent-500 animate-gradient-text animate-gradient-x">
              Trusted Services
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed md:text-xl text-ink-muted animate-fade-in">
            House Help Connect links you with verified professionals for cleaning, cooking, childcare and more — reliable, affordable, and hassle-free.
          </p>

          <div className="flex flex-col justify-center gap-4 mb-16 sm:flex-row animate-fade-in">
            <button
              onClick={() => navigate("/join")}
              className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 shadow-lg bg-primary-600 hover:bg-primary-700 rounded-2xl shadow-primary-600/30 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/40"
            >
              Get Started
            </button>
            <button
              onClick={scrollToServices}
              className="px-8 py-4 text-lg font-semibold transition-all duration-300 border shadow-sm bg-surface-card border-surface-border hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 text-ink-main rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20"
            >
              Explore Services
            </button>
          </div>

          {/* Floating showcase cards (desktop) */}
          <div className="relative hidden max-w-5xl mx-auto mb-16 lg:block" aria-hidden="true">
            <div className="absolute -top-6 left-2 flex items-center gap-3 px-5 py-4 border shadow-modern bg-surface-card/90 backdrop-blur rounded-2xl border-surface-border animate-float">
              <span className="flex items-center justify-center w-11 h-11 text-xl rounded-xl bg-primary-50">🧹</span>
              <span className="text-left">
                <span className="block text-sm font-bold text-ink-main">Deep Cleaning booked</span>
                <span className="block text-xs font-semibold text-status-success">✓ Pro confirmed · Tomorrow, 10 AM</span>
              </span>
            </div>
            <div className="absolute -top-2 right-2 flex items-center gap-3 px-5 py-4 border shadow-modern bg-surface-card/90 backdrop-blur rounded-2xl border-surface-border animate-float-slow">
              <span className="flex items-center justify-center w-11 h-11 text-xl rounded-xl bg-accent-100">⭐</span>
              <span className="text-left">
                <span className="block text-sm font-bold text-ink-main">4.9 average rating</span>
                <span className="block text-xs font-semibold text-ink-muted">from verified client reviews</span>
              </span>
            </div>
            <div className="h-16"></div>
          </div>

          {/* STATS with count-up */}
          <Reveal>
            <div className="grid grid-cols-2 gap-8 px-6 py-10 mx-auto bg-surface-card rounded-[2rem] shadow-modern border border-surface-border max-w-5xl">
              {STATS.map((stat, i) => (
                <StatItem key={stat.label} stat={stat} bordered={i > 0} />
              ))}
            </div>
          </Reveal>
        </div>

        {/* SERVICES MARQUEE */}
        <div className="relative z-10 pb-14">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max gap-4 pr-4 animate-marquee marquee-track">
              {[...categories, ...categories].map((cat, i) => (
                <span
                  key={`${cat.name}-${i}`}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-bold border shadow-soft whitespace-nowrap rounded-full bg-surface-card border-surface-border text-ink-main"
                >
                  <span className="text-xl">{cat.icon}</span> {cat.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20 bg-surface-card border-y border-surface-border">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Simple by design"
            title="How It Works"
            subtitle="Three steps between you and a well-run home."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 120}>
                <div className="relative h-full p-8 transition-all duration-300 bg-surface border border-surface-border rounded-3xl shadow-soft hover:shadow-modern hover:-translate-y-1.5">
                  <span className="absolute text-6xl font-extrabold top-5 right-7 text-primary-100 select-none">
                    {i + 1}
                  </span>
                  <div className="relative flex items-center justify-center mb-6 text-3xl w-16 h-16 bg-primary-50 rounded-2xl">
                    {step.icon}
                  </div>
                  <h3 className="relative mb-3 text-xl font-bold text-ink-main">{step.title}</h3>
                  <p className="relative leading-relaxed text-ink-muted">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section id="services" className="px-6 py-20 mx-auto max-w-7xl scroll-mt-20">
        <SectionHeading
          eyebrow="What we offer"
          title="Popular Services"
          subtitle="Everything you need to keep your home running smoothly, managed by experts."
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_SERVICES.map((srv, i) => (
            <Reveal key={srv.title} delay={(i % 3) * 110}>
              <div className="h-full p-8 transition-all duration-300 bg-surface-card border shadow-soft rounded-3xl border-surface-border hover:shadow-modern hover:-translate-y-1.5 group">
                <div className="flex items-center justify-center mb-6 text-3xl transition-transform duration-300 w-14 h-14 bg-primary-50 rounded-2xl group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary-100">
                  {srv.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-ink-main">{srv.title}</h3>
                <p className="leading-relaxed text-ink-muted">{srv.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-6 py-20 bg-primary-950 relative overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] h-[400px] bg-primary-600/20 rounded-full blur-3xl pointer-events-none animate-glow-pulse"></div>
        <div className="relative mx-auto max-w-7xl">
          <Reveal className="mb-14 text-center">
            <p className="mb-3 text-sm font-bold tracking-widest uppercase text-accent-400">Why House Help Connect</p>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Built on Trust, Priced Honestly</h2>
            <p className="max-w-2xl mx-auto text-lg text-primary-200">
              Hiring someone into your home takes trust. Every part of HHC is designed to earn it.
            </p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((f, i) => (
              <Reveal key={f.title} delay={i * 110}>
                <div className="h-full p-7 transition-all duration-300 border rounded-3xl bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 hover:-translate-y-1.5">
                  <div className="flex items-center justify-center mb-5 text-3xl w-14 h-14 bg-white/10 rounded-2xl">{f.icon}</div>
                  <h3 className="mb-2.5 text-lg font-bold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-primary-100/80">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TOP-RATED WORKERS PREVIEW */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Meet the pros"
          title="Top-Rated Professionals"
          subtitle="A glimpse of the verified professionals customers book again and again."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TOP_WORKERS.map((w, i) => (
            <Reveal key={w.name} delay={i * 110}>
              <div className="h-full p-6 transition-all duration-300 bg-surface-card border shadow-soft rounded-3xl border-surface-border hover:shadow-modern hover:-translate-y-1.5">
                <div className="flex items-center gap-3.5 mb-4">
                  <span className="flex items-center justify-center w-12 h-12 text-base font-black text-white rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shrink-0">
                    {w.initials}
                  </span>
                  <span>
                    <span className="block font-bold leading-tight text-ink-main">{w.name}</span>
                    <span className="block text-xs font-semibold text-ink-muted">📍 {w.city} · {w.exp}+ yrs</span>
                  </span>
                </div>
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold rounded-full bg-primary-50 text-primary-700">{w.service}</span>
                <div className="flex items-center justify-between pt-4 border-t border-surface-border">
                  <span className="text-sm font-bold text-amber-600">★ {w.rating.toFixed(1)} <span className="font-semibold text-ink-muted">({w.reviews})</span></span>
                  <span className="font-black text-ink-main">₹{w.rate}/hr</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <button
            onClick={() => navigate("/join")}
            className="px-8 py-3.5 font-bold text-white transition-all duration-300 shadow-lg bg-primary-600 hover:bg-primary-700 rounded-2xl shadow-primary-600/25 hover:-translate-y-0.5"
          >
            Browse All Professionals →
          </button>
        </Reveal>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-20 bg-amber-50 border-y border-amber-100">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Loved across India"
            title="What Our Users Say"
            subtitle="Real experiences from homeowners and professionals on the platform."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <figure className="flex flex-col h-full p-8 transition-all duration-300 bg-surface-card rounded-3xl border border-surface-border shadow-soft hover:shadow-modern hover:-translate-y-1.5">
                  <div className="mb-4 text-lg tracking-wide text-accent-500" aria-label="5 star rating">★★★★★</div>
                  <blockquote className="flex-1 leading-relaxed text-ink-main">“{t.quote}”</blockquote>
                  <figcaption className="flex items-center gap-3 pt-6 mt-6 border-t border-surface-border">
                    <span className="flex items-center justify-center w-11 h-11 text-sm font-bold text-white rounded-full bg-primary-600 shrink-0">
                      {t.initials}
                    </span>
                    <span>
                      <span className="block font-bold text-ink-main">{t.name}</span>
                      <span className="block text-sm text-ink-muted">{t.meta}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Questions"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before your first booking."
        />
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <FaqItem
                faq={faq}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative px-6 py-24 overflow-hidden text-center bg-gradient-to-r from-primary-800 via-primary-600 to-primary-800 animate-gradient-x animate-gradient-text">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl pointer-events-none animate-glow-pulse"></div>
        <Reveal className="relative max-w-3xl mx-auto">
          <h2 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">Ready to Book Your First Service?</h2>
          <p className="mb-10 text-lg text-primary-100 md:text-xl">
            Sign up today and experience hassle-free home services at your fingertips.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/join")}
              className="px-10 py-4 text-lg font-bold transition-all duration-300 shadow-xl bg-accent-500 text-white rounded-2xl hover:bg-accent-600 hover:scale-105 shadow-primary-950/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Create Your Account
            </button>
            <button
              onClick={() => navigate("/register?role=worker")}
              className="px-10 py-4 text-lg font-bold text-white transition-all duration-300 border-2 border-white/40 rounded-2xl hover:bg-white/10 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              Join as a Professional
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Landing;
