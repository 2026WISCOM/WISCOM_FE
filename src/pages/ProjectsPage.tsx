import { generatePath, Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { MOCK_PROJECTS } from "./projects/data/mockProjects";

export default function ProjectsPage() {
  return (
    <section className="min-h-full bg-page px-5 pt-navbar [--page-gap:21px] pb-16 text-ink">
      <h1 className="sr-only">프로젝트 목록</h1>
      <ul className="flex flex-col gap-8">
        {MOCK_PROJECTS.map((project) => (
          <li key={project.id}>
            <Link
              to={generatePath(ROUTES.projectDetail, { projectId: project.id })}
              className="flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
            >
              <img
                src={project.image}
                alt=""
                width={142}
                height={80}
                loading="lazy"
                className="h-20 w-[142px] shrink-0 rounded-sm object-cover"
              />
              <div className="min-w-0 break-keep">
                <h2 className="body-medium font-bold">{project.title}</h2>
                <p className="body-small mt-[3px]">{project.description}</p>
                <p className="body-xsmall mt-px text-muted">{project.members.map(({ name }) => name).join(" ")}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
