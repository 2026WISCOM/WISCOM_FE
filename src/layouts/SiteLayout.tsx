import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/layout/Footer";
import IconButton from "../components/ui/IconButton";
import { ROUTES } from "../constants/routes";

export default function SiteLayout() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { key, pathname } = useLocation();
  const isHomePage = pathname === ROUTES.home;
  const isExhibitionPage = pathname === ROUTES.exhibition;
  const isDirectionsPage = pathname === ROUTES.directions;
  const hasDarkBackground = isHomePage || isExhibitionPage || pathname === ROUTES.participants;

  return (
    <div className="site-shell">
      <div className="app-frame">
        <Navbar variant={hasDarkBackground ? "white" : "navy"} />
        <div ref={contentRef} key={key} className={`app-content${isExhibitionPage ? " bg-[#0e2540]" : ""}`}>
          <main className={isExhibitionPage || isDirectionsPage ? "grid" : "grid min-h-full"}>
            <Outlet />
          </main>
          {!isHomePage && <Footer />}
        </div>
        {pathname === ROUTES.projects && (
          <IconButton
            aria-label="맨 위로 이동"
            onClick={() => contentRef.current?.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
            })}
            className="absolute right-[34px] bottom-[34px] z-40 bg-navy text-white hover:bg-navy focus-visible:outline-navy"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12 7-7 7 7M12 5v14" />
            </svg>
          </IconButton>
        )}
      </div>
    </div>
  );
}
