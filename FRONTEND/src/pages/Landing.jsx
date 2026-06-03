import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-28 bg-surface">

      {/* HERO SECTION */}
      <section className="py-24 text-center bg-white border-b border-surface-border">
        <h1 className="text-4xl font-extrabold leading-tight md:text-6xl text-ink-main">
          Connecting Homes with <span className="text-brand">Trusted Services</span>
        </h1>
        <p className="max-w-2xl mx-auto mt-6 text-lg text-ink-muted">
          HHC is a platform that connects customers with verified professionals
          for reliable and affordable home services.
        </p>

        <div className="flex justify-center gap-4 mt-10">
          <button className="px-8 py-3.5 btn-brand text-lg" onClick={() => navigate("/join")}>
            Get Started
          </button>
          <button className="px-8 py-3.5 btn-outline text-lg bg-surface" onClick={scrollToServices}>
            Explore Services
          </button>
        </div>
      </section>

      {/* TRUST / STATS */}
      <section className="grid max-w-6xl grid-cols-2 gap-10 mx-auto text-center md:grid-cols-4">
        {[
          { label: "Active Users", stat: "50K+" },
          { label: "Average Rating", stat: "4.8★" },
          { label: "Cities Covered", stat: "120+" },
          { label: "Jobs Provided", stat: "10K+" }
        ].map((item, i) => (
          <div key={i}>
            <h2 className="text-4xl font-extrabold text-brand">{item.stat}</h2>
            <p className="mt-2 font-medium text-ink-muted">{item.label}</p>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      <section className="max-w-6xl pt-4 mx-auto mt-4" id="services">
        <h2 className="text-3xl text-center">Services We Provide</h2>
        <div className="grid gap-8 mt-12 md:grid-cols-3">
          {[
            { title: "Electrician", desc: "Certified electricians for wiring, repairs, and installations." },
            { title: "Plumber", desc: "Reliable plumbing solutions for homes and offices." },
            { title: "Home Cleaning", desc: "Professional cleaning services for hygienic living." }
          ].map((srv, i) => (
            <div key={i} className="p-8 modern-card">
              <h3 className="text-xl">{srv.title}</h3>
              <p className="mt-3 text-ink-muted">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 bg-white border-y border-surface-border">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl">Available Across Multiple Cities</h2>
          <p className="max-w-xl mx-auto mt-4 text-ink-muted">
            Our services are available in metro and tier-2 cities and expanding rapidly.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {['Delhi', 'Mumbai', 'Bangalore', 'Patna', 'Lucknow'].map(city => (
              <span key={city} className="px-6 py-2.5 font-semibold bg-surface border border-surface-border rounded-full text-ink-main">{city}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 text-center">
        <h2 className="text-3xl">Join Thousands of Happy Users</h2>
        <p className="mt-4 text-ink-muted">Sign up today and experience hassle-free home services.</p>
        <button className="px-10 py-4 mx-auto mt-8 text-lg btn-brand" onClick={() => navigate("/join")}>
          Create Account
        </button>
      </section>

    </div>
  );
};

export default Landing;