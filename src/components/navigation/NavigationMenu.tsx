import { NavLink } from "react-router-dom";
import { NAVIGATION_ITEMS } from "../../constants/routes";
import { cn } from "../../utils/cn";
import Drawer from "../ui/Drawer";

type NavigationMenuProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function NavigationMenu(props: NavigationMenuProps) {
  return (
    <Drawer {...props} title="주요 메뉴" headerClassName="navigation-menu-header">
      <nav aria-label="주요 메뉴" className="my-auto px-6 py-10 sm:px-10 lg:px-16">
        <ul className="flex flex-col gap-3 sm:gap-5">
          {NAVIGATION_ITEMS.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                onClick={props.onClose}
                className={({ isActive }) =>
                  cn(
                    "flex min-h-14 items-center rounded-2xl px-4 py-3 text-xl font-medium tracking-tight transition-colors hover:bg-navy/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy motion-reduce:transition-none sm:text-2xl lg:text-3xl",
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
