import { NavLink } from "react-router-dom";
import { NAVIGATION_ITEMS, ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";
import Drawer from "../ui/Drawer";

type NavigationMenuProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  variant: "white" | "navy";
};

export default function NavigationMenu({ variant, ...props }: NavigationMenuProps) {
  return (
    <Drawer {...props} title="주요 메뉴" headerClassName="navigation-menu-header">
      <nav aria-label="주요 메뉴" className={cn("my-auto px-6 py-10", variant === "white" ? "text-white" : "text-navy")}>
        <ul className="flex flex-col gap-3">
          {NAVIGATION_ITEMS.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                state={path === ROUTES.booths ? { boothGuide: true } : undefined}
                onClick={props.onClose}
                className={({ isActive }) =>
                  cn(
                    "heading-medium flex min-h-14 items-center rounded-2xl px-4 py-3 transition-colors hover:bg-navy/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy motion-reduce:transition-none",
                    isActive && "bg-navy/10",
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </Drawer>
  );
}
