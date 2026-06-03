import { Navigate } from "react-router-dom";
import { authService } from "../services/auth.service";

const ProtectedRoute = ({ children }) => {
  // We now use authService instead of the standalone isAuthenticated function
  return authService.isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;