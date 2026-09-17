import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import { ROUTES } from "../constants/routes";

export default function SiteLayout() {
  const { key, pathname } = useLocation();

  return (
    <div className="site-shell">
      <div className="app-frame">
        <Navbar variant={pathname === ROUTES.home ? "white" : "navy"} />
        <main key={key} className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
