import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/mockData";

const STATS = [
  { value: "50K+", label: "Active Users" },
  { value: "4.8★", label: "Average Rating" },
  { value: "120+", label: "Cities Covered" },
  { value: "10K+", label: "Jobs Completed" },
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
  { title: "Elderly Care", desc: "Compassionate companionship and daily assistance for your parents and grandparents.", icon: "💛" },
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

const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <div className="mb-14 text-center">
    <p className="mb-3 text-sm font-bold tracking-widest uppercase text-accent-600">{eyebrow}</p>
    <h2 className="mb-4 text-3xl font-bold md:text-4xl text-ink-main">{title}</h2>
    {subtitle && <p className="max-w-2xl mx-auto text-lg text-ink-muted">{subtitle}</p>}
  </div>
);

const FaqItem = ({ faq, isOpen, onToggle }) => (
  <div className="border bg-surface-card border-surface-border rounded-2xl shadow-soft overflow-hidden">
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
    {isOpen && <p className="px-6 pb-6 leading-relaxed text-ink-muted animate-fade-in">{faq.a}</p>}
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-sans bg-surface">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-surface to-surface">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-100/70 rounded-full blur-3xl -z-0 pointer-events-none"></div>

        <div className="relative z-10 px-6 pt-32 pb-20 mx-auto text-center lg:pt-40 lg:pb-28 max-w-7xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-bold rounded-full bg-accent-100 text-accent-700 border border-accent-200">
            🛡️ ID-verified professionals, on demand
          </span>

          <h1 className="flex flex-col gap-3 mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl text-ink-main">
            <span>Connecting Homes with</span>
            <span className="pb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500">
              Trusted Services
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed md:text-xl text-ink-muted">
            House Help Connect links you with verified professionals for cleaning, cooking, childcare and more — reliable, affordable, and hassle-free.
          </p>

          <div className="flex flex-col justify-center gap-4 mb-20 sm:flex-row">
            <button
              onClick={() => navigate("/join")}
              className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 shadow-lg bg-primary-600 hover:bg-primary-700 rounded-2xl shadow-primary-600/30 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/40"
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

          {/* STATS */}
          <div className="grid grid-cols-2 gap-8 px-6 py-10 mx-auto bg-surface-card rounded-[2rem] shadow-modern border border-surface-border max-w-5xl">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`flex flex-col items-center ${i > 0 ? "md:border-l md:border-surface-border" : ""}`}>
                <h3 className="mb-2 text-4xl font-extrabold md:text-5xl text-primary-600">{stat.value}</h3>
                <p className="text-xs font-bold tracking-wider uppercase md:text-sm text-ink-muted">{stat.label}</p>
              </div>
            ))}
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
              <div key={step.title} className="relative p-8 bg-surface border border-surface-border rounded-3xl shadow-soft">
                <span className="absolute text-6xl font-extrabold top-5 right-7 text-primary-100 select-none">
                  {i + 1}
                </span>
                <div className="relative flex items-center justify-center mb-6 text-3xl w-16 h-16 bg-primary-50 rounded-2xl">
                  {step.icon}
                </div>
                <h3 className="relative mb-3 text-xl font-bold text-ink-main">{step.title}</h3>
                <p className="relative leading-relaxed text-ink-muted">{step.desc}</p>
              </div>
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
          {POPULAR_SERVICES.map((srv) => (
            <div
              key={srv.title}
              className="p-8 transition-all duration-300 bg-surface-card border shadow-soft rounded-3xl border-surface-border hover:shadow-modern hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-center mb-6 text-3xl transition-transform duration-300 w-14 h-14 bg-primary-50 rounded-2xl group-hover:scale-110 group-hover:bg-primary-100">
                {srv.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-ink-main">{srv.title}</h3>
              <p className="leading-relaxed text-ink-muted">{srv.desc}</p>
            </div>
          ))}
        </div>

        {/* All categories strip */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {categories.map((cat) => (
            <span
              key={cat.name}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border rounded-full bg-surface-card border-surface-border text-ink-main"
            >
              <span>{cat.icon}</span> {cat.name}
            </span>
          ))}
        </div>
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
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex flex-col p-8 bg-surface-card rounded-3xl border border-surface-border shadow-soft">
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
            <FaqItem
              key={faq.q}
              faq={faq}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-24 text-center bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700">
        <div className="max-w-3xl mx-auto">
          <h2 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">Join Thousands of Happy Users</h2>
          <p className="mb-10 text-lg text-primary-100 md:text-xl">
            Sign up today and experience hassle-free home services at your fingertips.
          </p>
          <button
            onClick={() => navigate("/join")}
            className="px-10 py-4 text-lg font-bold transition-all duration-300 shadow-xl bg-accent-500 text-white rounded-2xl hover:bg-accent-600 hover:scale-105 shadow-primary-950/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            Create Your Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
