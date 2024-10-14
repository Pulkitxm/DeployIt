import { getProjectDetails } from "@/actions/db/user";
import ProjectSettings from "@/components/ProjectDetails/ProjectSetting";
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

  return <ProjectSettings project={project} />;
}
