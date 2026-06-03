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
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <form onSubmit={handleLogin} className="p-8 w-96 modern-card">
        <h2 className="mb-6 text-2xl text-center">Login to HHC</h2>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          className="w-full p-3 mb-4 border outline-none rounded-xl border-surface-border focus:ring-2 focus:ring-brand bg-surface"
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full p-3 mb-4 border outline-none rounded-xl border-surface-border focus:ring-2 focus:ring-brand bg-surface"
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          required
        />

        {error && <p className="mb-4 text-sm text-center text-status-error">{error}</p>}

        <button className="w-full btn-brand">Login securely</button>

        <p className="mt-6 text-sm text-center">
          New here? <Link to="/join" className="font-semibold text-brand hover:underline">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;