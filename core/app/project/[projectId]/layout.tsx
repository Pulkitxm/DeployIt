import { getProjectDetails } from "@/actions/db/user";
import ProtectRouteUI from "@/components/ProtectRoute";
import { getServerSession } from "next-auth";
import ProjectTabs from "@/components/ProjectDetails/ProjectTabs";

export default async function ProjectDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <ProtectRouteUI />
      </div>
    );
  }

  return (
    <div className="mx-auto h-full p-6 py-10 pb-40">
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Project Details</h1>
        <ProjectTabs projectId={params.projectId} />{" "}
      </header>
      {children}
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await getProjectDetails(params.id);
  return {
    title: project ? `${project.name} - Project Details` : "Project Not Found",
  };
}
