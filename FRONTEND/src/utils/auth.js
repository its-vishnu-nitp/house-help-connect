import api from "./api";

// REGISTER
export const registerUser = async (user) => {
  console.log("Registering user with data:", user);
  const res = await api.post("/auth/register", user);
  console.log("Registration response:", res.data);
  return res.data;
};

// LOGIN
export const loginUser = async ({ email, password }) => {
  console.log("Logging in with email:", email);
  const res = await api.post("/auth/login", { email, password });
  console.log("Login response:", res);
  // optional but very useful
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    console.log("Token stored in localStorage:", res.data.token);
    localStorage.setItem("currentUser", JSON.stringify(res.data.user));
  }

  return res.data;
};

// LOGOUT
export const logoutUser = () => {
  console.log("Logging out user");
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  return true; // helpful for UI logic
};

// AUTH CHECK
export const isAuthenticated = () => {
  console.log("Checking authentication status");
  console.log(Boolean(localStorage.getItem("token")));
  return Boolean(localStorage.getItem("token"));
};
