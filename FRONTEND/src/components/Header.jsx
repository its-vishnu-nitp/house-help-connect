import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-surface-card border-surface-border">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <Link to="/dashboard" className="flex items-center text-2xl font-bold text-brand">
          <svg viewBox="0 0 100 65" xmlns="http://www.w3.org/2000/svg" className="w-auto h-10 mr-2">
            <path d="M 5 35 L 22 25.2 V 10 H 30 V 20.6 L 50 9 L 95 35" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <text x="50" y="58" fontFamily="Arial, sans-serif" fontSize="30" fontWeight="900" fill="currentColor" textAnchor="middle" letterSpacing="1">HHC</text>
          </svg>
        </Link>

        <div className="flex items-center gap-4">
          {!authService.isAuthenticated() ? (
            <>
              <Link to="/login" className="font-semibold transition-colors text-ink-muted hover:text-brand">Login</Link>
              <Link to="/join" className="btn-brand !py-2 !px-5 !text-sm">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn-outline !py-2 !px-5 !text-sm text-status-error hover:border-status-error hover:text-status-error">Logout</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;