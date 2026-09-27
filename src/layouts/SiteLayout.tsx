import { useRef } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/layout/Footer";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import { ROUTES } from "../constants/routes";
import { cn } from "../utils/cn";

const DARK_NAVBAR_ROUTES: readonly string[] = [
  ROUTES.home,
  ROUTES.exhibition,
  ROUTES.neverEndingStory,
  ROUTES.guestbook,
  ROUTES.participants,
];

const CONTENT_HEIGHT_ROUTES: readonly string[] = [
  ROUTES.exhibition,
  ROUTES.directions,
  ROUTES.neverEndingStory,
];

export default function SiteLayout() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { key, pathname } = useLocation();
  const isHomePage = pathname === ROUTES.home;
  const isExhibitionPage = pathname === ROUTES.exhibition;
  const isProjectDetailPage = useMatch(ROUTES.projectDetail) !== null;
  const hasDarkBackground = DARK_NAVBAR_ROUTES.includes(pathname);
  const hasContentHeight = isProjectDetailPage || CONTENT_HEIGHT_ROUTES.includes(pathname);
  const showsScrollToTop = pathname === ROUTES.projects || pathname === ROUTES.neverEndingStory;

  function handleScrollToTop() {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <div className="site-shell">
      <div className="app-frame">
        <Navbar variant={hasDarkBackground ? "white" : "navy"} />
        <div ref={contentRef} key={key} className={cn("app-content", isExhibitionPage && "bg-deep-navy", isProjectDetailPage && "bg-page")}>
          <main className={hasContentHeight ? "grid" : "grid min-h-full"}>
            <Outlet />
          </main>
          {!isHomePage && <Footer />}
        </div>
        {showsScrollToTop && (
          <FloatingActionButton
            aria-label="맨 위로 이동"
            onClick={handleScrollToTop}
            className="bg-navy text-white hover:bg-navy focus-visible:outline-navy"
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
          </FloatingActionButton>
        )}
      </div>
    </div>
  );
}
