import { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import IconButton from "../ui/IconButton";
import NavigationMenu from "./NavigationMenu";
import "./Navbar.css";

type NavbarProps = {
  variant?: "white" | "navy";
};

export default function Navbar({ variant = "navy" }: NavbarProps) {
  const menuId = useId();
  const { key } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  useEffect(() => {
    setIsOpen(false);
  }, [key]);

  return (
    <header
      data-variant={variant}
      className="navbar absolute z-50"
    >
      <div className="navbar-bar glass-effect flex items-center justify-between gap-4 rounded-full">
        <Link
          to={ROUTES.home}
          onClick={close}
          className="heading-small ml-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          2026 WISCOM
        </Link>
        <IconButton
          aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-haspopup="dialog"
          onClick={() => setIsOpen(true)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {isOpen ? (
              <path d="m6 6 12 12M6 18 18 6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </IconButton>
      </div>
      <NavigationMenu id={menuId} isOpen={isOpen} onClose={close} />
    </header>
  );
}
