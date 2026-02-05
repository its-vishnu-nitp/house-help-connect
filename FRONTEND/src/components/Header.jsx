import { Link, useNavigate } from "react-router-dom";
import { logoutUser, isAuthenticated } from "../utils/auth";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          HHC
        </Link>

        <div>
          {!isAuthenticated() ? (
            <>
              <Link to="/login" className="mr-4 text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-white bg-blue-600 rounded"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-500 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
