import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/auth.service"; // Uses our new service layer

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const selectedRole = searchParams.get("role");
    if (!selectedRole) {
      navigate("/join"); 
    } else {
      setRole(selectedRole);
    }
  }, [searchParams, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // The component simply asks the service to register the user
      await authService.register({ name: username, email, password, role });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <form onSubmit={handleRegister} className="p-8 w-96 modern-card">
        <h2 className="mb-2 text-2xl text-center">Create Account</h2>
        <p className="mb-6 text-sm text-center capitalize text-ink-muted">
          Joining as a {role}
        </p>

        <input
          placeholder="Full Name"
          className="w-full p-3 mb-4 border outline-none rounded-xl border-surface-border focus:ring-2 focus:ring-brand bg-surface"
          onChange={(e) => { setUsername(e.target.value); setError(""); }}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 mb-4 border outline-none rounded-xl border-surface-border focus:ring-2 focus:ring-brand bg-surface"
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border outline-none rounded-xl border-surface-border focus:ring-2 focus:ring-brand bg-surface"
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          required
        />

        {error && <p className="mb-4 text-sm text-center text-status-error">{error}</p>}

        <button className="w-full mt-2 btn-brand">
          Register
        </button>

        <p className="mt-6 text-sm text-center">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;