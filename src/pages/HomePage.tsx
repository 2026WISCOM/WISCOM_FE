import wiscomImage from "../assets/optimized/wiscom.webp";
import GlassLink from "../components/ui/GlassLink";
import { ROUTES } from "../constants/routes";
import { HOME_QUICK_LINKS } from "./home/constants";

export default function HomePage() {
  return (
    <section className="glass-dark flex min-h-full flex-col justify-end px-5 pt-28 pb-12">
      <h1 className="sr-only">2026 WISCOM</h1>
      <div className="flex flex-1 items-start justify-center py-8">
        <img
          src={wiscomImage}
          alt="WISCOM: Beneath the Surface, 컴퓨터공학전공 제36회 졸업프로젝트 전시회"
          width={768}
          height={364}
          fetchPriority="high"
          className="h-auto w-full"
        />
      </div>
      <nav aria-label="전시 바로가기" className="grid grid-cols-2 gap-x-[11px] gap-y-4">
        {HOME_QUICK_LINKS.map(({ label, path }) => (
          <GlassLink key={path} to={path} state={path === ROUTES.booths ? { boothGuide: true } : undefined} className="body-medium text-white">
            {label}
          </GlassLink>
        ))}
      </nav>
    </section>
  );
}
