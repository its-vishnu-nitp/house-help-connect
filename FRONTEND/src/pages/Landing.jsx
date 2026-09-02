import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const scrollToServices = () => {
    document.getElementById("services").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-sans bg-surface">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden lg:pt-40 lg:pb-28 bg-surface">
        {/* Subtle Brand Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-light rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 px-6 mx-auto text-center max-w-7xl">
          {/* Headline with Ink and Brand Gradient */}
          <h1 className="flex flex-col gap-3 mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl text-ink-main">
            <span>Connecting Homes with</span>
            <span className="pb-2 text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-accent">
              Trusted Services
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed md:text-xl text-ink-muted">
            HHC is a premium platform connecting customers with verified professionals for reliable, affordable, and hassle-free home services.
          </p>

          <div className="flex flex-col justify-center gap-4 mb-20 sm:flex-row">
            {/* Primary Button */}
            <button
              onClick={() => navigate("/join")}
              className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 shadow-lg bg-brand hover:bg-brand-dark rounded-2xl shadow-brand/30 hover:-translate-y-1"
            >
              Get Started
            </button>

            {/* Secondary Button */}
            <button
              onClick={scrollToServices}
              className="px-8 py-4 text-lg font-semibold transition-all duration-300 border shadow-sm bg-surface-card border-surface-border hover:border-brand-light hover:bg-brand-light hover:text-brand-dark text-ink-main rounded-2xl"
            >
              Explore Services
            </button>
          </div>

          {/* STATS SECTION */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 bg-surface-card rounded-[2rem] shadow-modern border border-surface-border max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <h3 className="mb-2 text-4xl font-extrabold md:text-5xl text-brand">50K+</h3>
              <p className="text-xs font-bold tracking-wider uppercase md:text-sm text-ink-muted">Active Users</p>
            </div>
            <div className="flex flex-col items-center border-l border-surface-border">
              <h3 className="mb-2 text-4xl font-extrabold md:text-5xl text-brand">4.8★</h3>
              <p className="text-xs font-bold tracking-wider uppercase md:text-sm text-ink-muted">Average Rating</p>
            </div>
            <div className="flex flex-col items-center border-l border-surface-border">
              <h3 className="mb-2 text-4xl font-extrabold md:text-5xl text-brand">120+</h3>
              <p className="text-xs font-bold tracking-wider uppercase md:text-sm text-ink-muted">Cities Covered</p>
            </div>
            <div className="flex flex-col items-center border-l border-surface-border">
              <h3 className="mb-2 text-4xl font-extrabold md:text-5xl text-brand">10K+</h3>
              <p className="text-xs font-bold tracking-wider uppercase md:text-sm text-ink-muted">Jobs Provided</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="px-6 py-20 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl text-ink-MAIN">Services We Provide</h2>
          <p className="max-w-2xl mx-auto text-lg text-ink-MUTED">Everything you need to keep your home running smoothly, managed by experts.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { title: "Electrician", desc: "Certified electricians for wiring, repairs, and safe installations.", icon: "⚡" },
            { title: "Plumber", desc: "Reliable plumbing solutions for homes and modern offices.", icon: "🚰" },
            { title: "Home Cleaning", desc: "Professional deep cleaning services for a hygienic living space.", icon: "✨" }
          ].map((srv, i) => (
            <div key={i} className="p-8 transition-all duration-300 bg-surface-card border shadow-lg rounded-3xl border-surface-BORDER shadow-slate-200/40 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 group">
              <div className="flex items-center justify-center mb-6 text-2xl transition-transform duration-300 w-14 h-14 bg-brand-LIGHT rounded-2xl group-hover:scale-110">
                {srv.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-ink-MAIN">{srv.title}</h3>
              <p className="leading-relaxed text-ink-MUTED">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-24 mt-20 text-center bg-brand">
        <div className="max-w-3xl mx-auto">
          <h2 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">Join Thousands of Happy Users</h2>
          <p className="mb-10 text-lg text-blue-100 md:text-xl">Sign up today and experience hassle-free home services at your fingertips.</p>
          <button
            onClick={() => navigate("/join")}
            className="px-10 py-4 text-lg font-bold text-brand transition-all duration-300 bg-surface-card shadow-xl rounded-2xl hover:bg-surface hover:scale-105 shadow-blue-900/20"
          >
            Create Your Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;