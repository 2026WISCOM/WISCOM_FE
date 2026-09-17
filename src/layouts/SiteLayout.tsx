import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";

export default function SiteLayout() {
  const { key } = useLocation();

  return (
    <>
      <Navbar key={key} variant="navy" />
      <main>
        <Outlet />
      </main>
    </>
  );
}
