export type ProjectMember = {
  name: string;
  roles: string[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  studioNumber: number;
  introduction: string;
  demoFeatures: string[];
  teamName: string;
  teamImage: string;
  members: ProjectMember[];
  serviceUrl?: string;
  githubUrl?: string;
};

export type ProjectTeam = Pick<Project, "id" | "teamName">;
