import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import Button from "./ui/Button";

function AppHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="content-wrap flex items-center justify-between py-4">
        <div>
          <p className="text-sm text-slate-500">Welcome back</p>
          <p className="text-base font-semibold text-saas-text">
            {user?.name || "Guest User"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Notifications
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-saas-text">
              {user?.role || "public"}
            </p>
            <p className="text-xs text-slate-500">Role</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
