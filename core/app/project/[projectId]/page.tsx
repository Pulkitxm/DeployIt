import { redirect } from "next/navigation";

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  redirect(`/project/${params.projectId}/overview`);
}
