import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      loginUser({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setPassword("");
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          className="w-full p-2 mb-4 border rounded input-field"
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password} 
          className="w-full p-2 mb-4 border rounded input-field"
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
        />

        <p className="h-2 mb-4 text-sm text-left text-red-600">
          {error && `**${error}`}
        </p>


        <button className="w-full py-2 mt-1 text-white bg-blue-600 rounded btn">
          Login
        </button>

        <p className="mt-4 text-center">
          No account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
