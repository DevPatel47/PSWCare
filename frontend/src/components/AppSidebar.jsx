import { Link, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const navByRole = {
  client: [
    { to: "/dashboard/client", label: "Dashboard" },
    { to: "/psw-search", label: "Search PSWs" },
    { to: "/bookings", label: "Bookings" },
    { to: "/messages", label: "Messages" },
    { to: "/notifications", label: "Notifications" },
    { to: "/profile/edit", label: "Profile" },
  ],
  psw: [
    { to: "/dashboard/psw", label: "Dashboard" },
    { to: "/bookings", label: "Bookings" },
    { to: "/messages", label: "Messages" },
    { to: "/notifications", label: "Notifications" },
    { to: "/availability", label: "Availability" },
    { to: "/profile/edit", label: "Profile" },
  ],
  admin: [
    { to: "/dashboard/admin", label: "Dashboard" },
    { to: "/admin/users", label: "User Management" },
    { to: "/admin/verification", label: "PSW Verification" },
    { to: "/admin/disputes", label: "Dispute Management" },
    { to: "/notifications", label: "Notifications" },
  ],
};

function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || "client";
  const links = navByRole[role] || navByRole.client;

  return (
    <aside className="app-sidebar">
      <div className="mb-8">
        <Link to="/" className="text-xl font-bold text-saas-text">
          PSWCares
        </Link>
        <p className="mt-1 text-xs text-slate-500">
          Healthcare Operations Platform
        </p>
      </div>

      <nav className="space-y-1.5">
        {links.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${active ? "nav-item-active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default AppSidebar;
