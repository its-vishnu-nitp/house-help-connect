import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import AuthHeader from "./components/AuthHeader";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES (with Header + Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AuthHeader />
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* <Route path="/dashboard/profile" element={<Profile />} /> */}
        </Route>  

      </Routes>
    </BrowserRouter>
  );
}

export default App;
