import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/auth.service";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "";

  useEffect(() => {
    if (!role) {
      navigate("/join");
    }
  }, [role, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authService.register({ name: username, email, password, role });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-surface px-6 font-sans py-12">
      <div className="w-full max-w-md p-10 bg-surface-card rounded-[2rem] shadow-modern border border-surface-border">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-ink-main">Create Account</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100">
            <span className="text-sm font-medium text-ink-muted">Joining as a</span>
            <span className={`text-sm font-bold uppercase tracking-wide ${role === 'client' ? 'text-brand' : 'text-accent-600'}`}>
              {role}
            </span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-4 transition-all border outline-none bg-surface border-surface-border rounded-2xl text-slate-700 focus:bg-surface-card focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15"
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-4 transition-all border outline-none bg-surface border-surface-border rounded-2xl text-slate-700 focus:bg-surface-card focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15"
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 transition-all border outline-none bg-surface border-surface-border rounded-2xl text-slate-700 focus:bg-surface-card focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15"
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            required
          />

          {error && (
            <div className="p-3 text-center border border-red-100 bg-red-50 rounded-xl">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

          <button className="w-full py-4 mt-6 text-lg font-bold text-white transition-all duration-300 bg-brand shadow-lg hover:bg-brand-dark rounded-2xl shadow-primary-600/30 hover:-translate-y-1">
            Register Now
          </button>

          <p className="mt-6 font-medium text-center text-ink-muted">
            Already registered?{" "}
            <Link to="/login" className="font-bold text-brand hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;