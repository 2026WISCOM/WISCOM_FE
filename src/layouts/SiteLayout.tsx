import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/layout/Footer";
import { ROUTES } from "../constants/routes";

export default function SiteLayout() {
  const { key, pathname } = useLocation();
  const isHomePage = pathname === ROUTES.home;

  return (
    <div className="site-shell">
      <div className="app-frame">
        <Navbar variant={isHomePage ? "white" : "navy"} />
        <div key={key} className="app-content">
          <main className="grid min-h-full">
            <Outlet />
          </main>
          {!isHomePage && <Footer />}
        </div>
      </div>
    </div>
  );
}
