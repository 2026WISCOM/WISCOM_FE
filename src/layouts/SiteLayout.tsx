import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";

export default function SiteLayout() {
  const { key } = useLocation();

  return (
    <div className="site-shell">
      <div className="app-frame">
        <Navbar variant="navy" />
        <main key={key} className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
