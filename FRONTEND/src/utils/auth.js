export const registerUser = (user) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find((u) => u.email === user.email);
  if (exists) throw new Error("User already exists");

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

export const loginUser = ({ email, password }) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) => u.email === email && u.password === password
  ); 

  if (!user){
    throw new Error("Invalid email or password");
  }

  localStorage.setItem("token", "local_auth_token");
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
