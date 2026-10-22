import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import AuthHeader from "./components/AuthHeader";
import ServerStatusBanner from "./components/ServerStatusBanner";
import Toast from "./components/Toast";
import ErrorBoundary from "./components/ErrorBoundary";

// Route-level code splitting — the landing page and the dashboards no
// longer ship in one bundle to every visitor.
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 rounded-full border-brand/20 border-t-brand animate-spin"></div>
      <p className="text-sm font-semibold tracking-wide text-ink-muted">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ServerStatusBanner />
      <Toast />
      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* PUBLIC ROUTES (With Header, Body Content, and Footer) */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/join" element={<RoleSelection />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* PROTECTED ROUTES (Requires dynamic token checking) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AuthHeader />
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <AuthHeader />
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
