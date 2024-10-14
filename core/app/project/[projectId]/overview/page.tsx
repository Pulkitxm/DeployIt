import { getProjectDetails } from "@/actions/db/user";
import ProjectDetails from "@/components/ProjectDetails";
import { notFound } from "next/navigation";

export default async function ProjectOverviewPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await getProjectDetails(params.projectId);

  if (!project) {
    return notFound();
  }

  return <ProjectDetails project={project} />;
}
