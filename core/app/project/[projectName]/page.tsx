import { getProjectDetails } from "@/actions/user/project";
import ErroDiv from "@/components/ui/ErrorDiv";
import ProtectRouteUI from "@/components/ProtectRoute";
import { getServerSession } from "next-auth";
import ProjectDetails from "@/components/ProjectDetails";

export default async function ProjectDetailsPage({
  projectName,
}: {
  projectName: string;
}) {
  const session = await getServerSession();
  if (!session)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <ProtectRouteUI />
      </div>
    );

  const project = await getProjectDetails(projectName);

  if (!project) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <ErroDiv
          title="Project Not Found"
          description="The project you're looking for doesn't exist."
          link="/dashboard"
        />
      </div>
    );
  }

  return <ProjectDetails project={project} />;
}
