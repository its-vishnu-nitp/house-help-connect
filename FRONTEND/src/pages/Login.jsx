import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authService.login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setPassword("");
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-surface px-6 font-sans">
      <div className="w-full max-w-md p-10 bg-surface-card rounded-[2rem] shadow-modern border border-surface-BORDER">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-3xl text-brand bg-brand-LIGHT rounded-2xl">
            👋
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-MAIN">Welcome Back</h2>
          <p className="mt-2 text-ink-MUTED">Sign in to your HHC account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              className="w-full p-4 transition-all border outline-none bg-surface border-surface-BORDER rounded-2xl text-slate-700 focus:bg-surface-card focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              className="w-full p-4 transition-all border outline-none bg-surface border-surface-BORDER rounded-2xl text-slate-700 focus:bg-surface-card focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
            />
          </div>

          {error && (
            <div className="p-3 text-center border border-red-100 bg-red-50 rounded-xl">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

          <button className="w-full py-4 mt-4 text-lg font-bold text-white transition-all duration-300 bg-brand shadow-lg hover:bg-brand-DARK rounded-2xl shadow-blue-600/30 hover:-translate-y-1">
            Login Securely
          </button>

          <p className="mt-8 font-medium text-center text-ink-MUTED">
            New here?{" "}
            <Link to="/join" className="font-bold text-brand hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;