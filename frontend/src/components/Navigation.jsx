import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import ClayButton from "./ui/ClayButton";

function Navigation() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const dashboardPath = user?.role ? `/dashboard/${user.role}` : "/login";

  return (
    <nav className="clay-navbar">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-bold text-clay-text">
          PSWCares
        </Link>
        <Link
          to="/psw-search"
          className="text-sm font-semibold text-clay-text/80 transition-all duration-300 hover:text-clay-primary"
        >
          Find PSWs
        </Link>
        {isAuthenticated ? (
          <Link
            to={dashboardPath}
            className="text-sm font-semibold text-clay-text/80 transition-all duration-300 hover:text-clay-primary"
          >
            Dashboard
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <span className="text-sm font-semibold text-clay-text/70">
              {user?.name} ({user?.role})
            </span>
            <ClayButton
              variant="secondary"
              className="!px-4 !py-2 text-sm"
              onClick={handleLogout}
            >
              Logout
            </ClayButton>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-semibold text-clay-text/80 transition-all duration-300 hover:text-clay-primary"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-clay-text/80 transition-all duration-300 hover:text-clay-primary"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
