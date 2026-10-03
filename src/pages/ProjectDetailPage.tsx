import { Fragment } from "react";
import { createSearchParams, generatePath, Link, useParams } from "react-router-dom";
import ContentSection from "../components/ui/ContentSection";
import GlassLink from "../components/ui/GlassLink";
import { ROUTES } from "../constants/routes";
import { PROJECTS } from "../data/projects";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const project = PROJECTS.find(({ id }) => id === projectId);

  if (!project) {
    return (
      <section className="bg-page px-5 pt-navbar [--page-gap:43px] pb-32 text-ink">
        <h1 className="heading-large">프로젝트를 찾을 수 없습니다</h1>
        <Link to={ROUTES.projects} className="body-medium mt-4 inline-block rounded-sm underline focus-visible:outline-2 focus-visible:outline-offset-4">
          프로젝트 목록으로 돌아가기
        </Link>
      </section>
    );
  }

  const relatedProjects = PROJECTS.filter(
    ({ id, studioNumber }) => id !== project.id && studioNumber === project.studioNumber,
  );

  return (
    <article className="bg-page px-5 pt-navbar [--page-gap:43px] pb-32 text-ink break-keep">
      <img
        src={project.image}
        alt={`${project.title} 미리보기`}
        className="h-auto w-full rounded-[8px]"
      />

      <header className="mt-[15px] flex flex-col items-center text-center">
        <h1 className="heading-large">{project.title}</h1>
        {project.description && <p className="body-medium">{project.description}</p>}
        <p className="body-small mt-[7px] rounded-full border border-navy px-[18px] py-0.5 text-navy">
          스튜디오 {project.studioNumber}
        </p>
      </header>

      <ContentSection headingId="project-introduction" title="프로젝트 소개" className="mt-[52px]">
        <p className="body-small whitespace-pre-line">{project.introduction}</p>
      </ContentSection>

      <ContentSection headingId="project-demo" title="현장 시연 기능" className="mt-9">
        {project.demoFeatures.length > 0 ? (
          <ul className="body-small flex list-disc flex-col gap-1.5 pl-5">
            {project.demoFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        ) : (
          <p className="body-small">시연 안내를 준비 중입니다.</p>
        )}
      </ContentSection>

      <ContentSection headingId="project-team" title="만든 사람들" className="mt-9">
        <div className="flex items-center gap-3">
          <img
            src={project.teamImage}
            alt={`${project.teamName} 팀 이미지`}
            width={120}
            height={120}
            loading="lazy"
            className="size-[120px] shrink-0 rounded-[6px] object-cover"
          />
          <div className="flex min-w-0 flex-col gap-1.5">
            <h3 className="body-medium font-bold">{project.teamName}</h3>
            <ul className="body-small flex flex-col gap-1.5">
              {project.members.map(({ name, roles }) => (
                <li key={name}>
                  <strong className="font-bold">{name}</strong>{roles.length > 0 && ` ${roles.join(" · ")}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ContentSection>

      <nav
        aria-label="프로젝트 참여 안내"
        className="mt-16 flex flex-col gap-[18px] [--glass-background:var(--color-ink)] [--glass-fallback-background:var(--color-ink)] [--glass-solid-background:var(--color-ink)]"
      >
        <GlassLink
          to={{
            pathname: ROUTES.booths,
            search: createSearchParams({ studio: String(project.studioNumber) }).toString(),
          }}
          className="body-medium w-full text-white focus-visible:ring-2 focus-visible:ring-navy"
        >
          부스 위치 보기
        </GlassLink>
        <GlassLink
          to={{
            pathname: ROUTES.guestbook,
            search: createSearchParams({ projectId: project.id }).toString(),
          }}
          className="body-medium w-full text-white focus-visible:ring-2 focus-visible:ring-navy"
        >
          응원의 한마디 남기기
        </GlassLink>
      </nav>

      {relatedProjects.length > 0 && (
        <nav aria-label="함께 전시되는 프로젝트" className="body-xsmall mt-[13px] flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center text-[#7a7a7a]">
          <p>스튜디오 {project.studioNumber}에서 함께 전시되는 프로젝트</p>
          <p className="whitespace-pre-wrap">
            {relatedProjects.map((related, index) => (
              <Fragment key={related.id}>
                {index > 0 && "   "}
                <Link
                  to={generatePath(ROUTES.projectDetail, { projectId: related.id })}
                  className="rounded-sm font-bold whitespace-nowrap underline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {related.teamName}
                </Link>
              </Fragment>
            ))}
          </p>
        </nav>
      )}
    </article>
  );
}
