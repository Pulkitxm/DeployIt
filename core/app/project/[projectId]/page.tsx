import { getProjectDetails } from "@/actions/db/user";
import ErroDiv from "@/components/ui/ErrorDiv";
import ProtectRouteUI from "@/components/ProtectRoute";
import { getServerSession } from "next-auth";
import ProjectDetails from "@/components/ProjectDetails";

export default async function ProjectDetailsPage({
  projectId,
}: {
  projectId: string;
}) {
  const session = await getServerSession();
  if (!session)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <ProtectRouteUI />
      </div>
    );

  let project: Awaited<ReturnType<typeof getProjectDetails>> = null;
  try {
    project = await getProjectDetails(projectId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <ProtectRouteUI />
      </div>
    );
  }

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
