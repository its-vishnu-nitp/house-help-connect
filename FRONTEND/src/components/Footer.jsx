import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      {/* THIN SEPARATOR LINE */}
      <div className="border-t border-gray-200"></div>

      <footer className="text-gray-600 bg-gray-50">
        <div className="grid gap-10 px-6 mx-auto max-w-7xl py-14 md:grid-cols-4">

          {/* ================= BRAND ================= */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">HHC</h2>
            <p className="mt-4 text-sm leading-relaxed">
              HHC is a trusted home service platform connecting households
              with verified professionals while creating employment
              opportunities across India.
            </p>
          </div>

          {/* ================= SERVICES ================= */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Electrician</li>
              <li>Plumber</li>
              <li>Home Cleaning</li>
              <li>Appliance Repair</li>
              <li>Painting</li>
            </ul>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-gray-900">Home</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gray-900">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-900">Register</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-gray-900">Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* ================= CONTACT ================= */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Email: support@hhc.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Working Hours: 9 AM – 6 PM</li>
              <li>India</li>
            </ul>
          </div>

        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="py-4 text-sm text-center text-gray-500 border-t border-gray-200">
          © {new Date().getFullYear()} HHC. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
