import { useParams } from "react-router-dom";

export default function ProjectDetailPage() {
  const { projectId } = useParams();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Project Detail</h1>
    </div>
  );
}
