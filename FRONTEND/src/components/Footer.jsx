import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-surface border-surface-border">
      <div className="grid gap-12 px-6 py-16 mx-auto max-w-7xl md:grid-cols-4">
        
        <div>
          <h2 className="text-2xl font-extrabold text-brand">HHC</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            HHC is a trusted home service platform connecting households with verified professionals while creating employment opportunities across India.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-lg text-ink-main">Services</h3>
          <ul className="space-y-3 text-sm font-medium text-ink-muted">
            <li className="transition-colors cursor-pointer hover:text-brand">Electrician</li>
            <li className="transition-colors cursor-pointer hover:text-brand">Plumber</li>
            <li className="transition-colors cursor-pointer hover:text-brand">Home Cleaning</li>
            <li className="transition-colors cursor-pointer hover:text-brand">Appliance Repair</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-lg text-ink-main">Quick Links</h3>
          <ul className="space-y-3 text-sm font-medium text-ink-muted">
            <li><Link to="/" className="transition-colors hover:text-brand">Home</Link></li>
            <li><Link to="/login" className="transition-colors hover:text-brand">Login</Link></li>
            <li><Link to="/join" className="transition-colors hover:text-brand">Register</Link></li>
            <li><Link to="/dashboard" className="transition-colors hover:text-brand">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-lg text-ink-main">Contact Us</h3>
          <ul className="space-y-3 text-sm font-medium text-ink-muted">
            <li>support@hhc.com</li>
            <li>+91 98765 43210</li>
            <li>9 AM – 6 PM</li>
            <li>India</li>
          </ul>
        </div>

      </div>
      <div className="py-6 text-sm font-medium text-center border-t text-ink-muted border-surface-border">
        © {new Date().getFullYear()} House Help Connect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;