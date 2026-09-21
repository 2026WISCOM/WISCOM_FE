import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/layout/Footer";
import { ROUTES } from "../constants/routes";

export default function SiteLayout() {
  const { key, pathname } = useLocation();
  const isHomePage = pathname === ROUTES.home;
  const isExhibitionPage = pathname === ROUTES.exhibition;
  const isDirectionsPage = pathname === ROUTES.directions;
  const hasDarkBackground = isHomePage || isExhibitionPage || pathname === ROUTES.participants;

  return (
    <div className="site-shell">
      <div className="app-frame">
        <Navbar variant={hasDarkBackground ? "white" : "navy"} />
        <div key={key} className={`app-content${isExhibitionPage ? " bg-[#0e2540]" : ""}`}>
          <main className={isExhibitionPage || isDirectionsPage ? "grid" : "grid min-h-full"}>
            <Outlet />
          </main>
          {!isHomePage && <Footer />}
        </div>
      </div>
    </div>
  );
}
