import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../utils/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    try {
      registerUser({ name, email, password });
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="p-8 bg-white rounded shadow w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Register</h2>

        <input
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded input-field"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded input-field"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded input-field"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full py-2 mt-6 text-white bg-blue-600 rounded btn">
          Register
        </button>

        <p className="mt-4 text-center">
          Already registered? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
