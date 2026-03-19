import { Link, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const navByRole = {
  client: [
    { to: "/dashboard/client", label: "Dashboard" },
    { to: "/psw-search", label: "Search" },
    { to: "/bookings", label: "Bookings" },
    { to: "/messages", label: "Messages" },
  ],
  psw: [
    { to: "/dashboard/psw", label: "Dashboard" },
    { to: "/bookings", label: "Bookings" },
    { to: "/availability", label: "Calendar" },
    { to: "/messages", label: "Messages" },
  ],
  admin: [
    { to: "/dashboard/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/verification", label: "Verify" },
    { to: "/notifications", label: "Alerts" },
  ],
};

function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || "client";
  const links = navByRole[role] || navByRole.client;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-2 py-2 lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-md px-2 py-2 text-center text-xs font-medium ${
                isActive ? "bg-blue-50 text-saas-primary" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNav;
