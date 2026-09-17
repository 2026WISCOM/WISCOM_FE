import GlassLink from "../components/ui/GlassLink";
import { HOME_QUICK_LINKS } from "./home/constants";
import "./home/HomePage.css";

export default function HomePage() {
  return (
    <section className="home-page flex min-h-full flex-col justify-end px-5 pt-28 pb-[91px]">
      <h1 className="sr-only">2026 WISCOM</h1>
      <nav aria-label="전시 바로가기" className="grid grid-cols-2 gap-x-[11px] gap-y-4">
        {HOME_QUICK_LINKS.map(({ label, path }) => (
          <GlassLink key={path} to={path} className="body-medium">
            {label}
          </GlassLink>
        ))}
      </nav>
    </section>
  );
}
