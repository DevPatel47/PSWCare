import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import AppHeader from "../components/AppHeader";
import MobileNav from "../components/MobileNav";
import AppSidebar from "../components/AppSidebar";
import useAuth from "../hooks/useAuth";

function MainLayout({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isPublicPage = useMemo(() => {
    const path = location.pathname;
    return (
      path === "/" ||
      path === "/login" ||
      path === "/register" ||
      path === "/auth/role" ||
      path === "/forgot-password" ||
      path.startsWith("/psw/")
    );
  }, [location.pathname]);

  if (!isAuthenticated || isPublicPage) {
    return <main className="app-shell">{children}</main>;
  }

  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-main">
        <AppHeader />
        <main className="content-wrap">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}

export default MainLayout;
