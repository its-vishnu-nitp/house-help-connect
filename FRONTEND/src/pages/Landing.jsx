import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const scrollToServices = () => {
    const section = document.getElementById("services");
    section?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="space-y-28">

      {/* ================= HERO SECTION ================= */}
      <section className="py-24 text-center bg-gray-50">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">
          Connecting Homes with <span className="text-blue-600">Trusted Services</span>
        </h1>
        <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-600">
          HHC is a platform that connects customers with verified professionals
          for reliable and affordable home services.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <button className="px-6 py-3 text-white bg-blue-600 rounded-lg"
          onClick={() => navigate("/register")}>
            Get Started
          </button>
          <button className="px-6 py-3 border border-gray-300 rounded-lg" onClick={scrollToServices}>
            Explore Services
          </button>
        </div>
      </section>

      {/* ================= TRUST / STATS ================= */}
      <section className="grid max-w-6xl grid-cols-2 gap-10 mx-auto text-center md:grid-cols-4">
        <div>
          <h2 className="text-4xl font-bold text-blue-600">50K+</h2>
          <p className="mt-2 text-gray-600">Active Users</p>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-blue-600">4.8★</h2>
          <p className="mt-2 text-gray-600">Average Rating</p>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-blue-600">120+</h2>
          <p className="mt-2 text-gray-600">Cities Covered</p>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-blue-600">10K+</h2>
          <p className="mt-2 text-gray-600">Jobs Provided</p>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="max-w-6xl pt-4 mx-auto mt-4" id="services">
        <h2 className="text-3xl font-semibold text-center">
          Services We Provide
        </h2>

        <div className="grid gap-8 mt-12 md:grid-cols-3">
          <div className="p-6 border rounded-xl">
            <h3 className="text-xl font-semibold">Electrician</h3>
            <p className="mt-2 text-gray-600">
              Certified electricians for wiring, repairs, and installations.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="text-xl font-semibold">Plumber</h3>
            <p className="mt-2 text-gray-600">
              Reliable plumbing solutions for homes and offices.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="text-xl font-semibold">Home Cleaning</h3>
            <p className="mt-2 text-gray-600">
              Professional cleaning services for hygienic living.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SERVICE AREAS ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold">
            Available Across Multiple Cities
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-gray-600">
            Our services are available in metro and tier-2 cities and expanding rapidly.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="px-4 py-2 bg-white border rounded-full">Delhi</span>
            <span className="px-4 py-2 bg-white border rounded-full">Mumbai</span>
            <span className="px-4 py-2 bg-white border rounded-full">Bangalore</span>
            <span className="px-4 py-2 bg-white border rounded-full">Patna</span>
            <span className="px-4 py-2 bg-white border rounded-full">Lucknow</span>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center">
          How HHC Works
        </h2>

        <div className="grid gap-10 mt-12 text-center md:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold">1. Choose Service</h3>
            <p className="mt-2 text-gray-600">
              Select the service you need from our wide range of options.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">2. Get Matched</h3>
            <p className="mt-2 text-gray-600">
              We connect you with verified professionals nearby.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">3. Get Work Done</h3>
            <p className="mt-2 text-gray-600">
              Sit back and enjoy reliable, on-time service.
            </p>
          </div>
        </div>
      </section>

      {/* ================= ABOUT PLATFORM ================= */}
      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold">About HHC</h2>
        <p className="mt-6 text-lg text-gray-600">
          HHC was built with a vision to empower service professionals
          by creating job opportunities while delivering trusted services
          to households across India.
        </p>
      </section>

      {/* ================= FOUNDERS ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold">Meet the Founders</h2>

          <div className="grid gap-12 mt-12 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold">Founder Name</h3>
              <p className="mt-2 text-gray-600">
                Passionate about building scalable platforms and creating impact.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Co-Founder Name</h3>
              <p className="mt-2 text-gray-600">
                Focused on operations, growth, and customer experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-semibold">
          Join Thousands of Happy Users
        </h2>
        <p className="mt-4 text-gray-600">
          Sign up today and experience hassle-free home services.
        </p>

        <button className="px-8 py-3 mt-6 text-white bg-blue-600 rounded-lg">
          Create Account
        </button>
      </section>

    </div>
  );
};

export default Landing;
