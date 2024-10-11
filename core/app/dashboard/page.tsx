import { getProjects } from "@/actions/user/project";
import New from "@/app/new/page";
import Projects from "@/components/Dashboard/Projects";
import ProtectRouteUI from "@/components/ProtectRoute";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <ProtectRouteUI />
      </div>
    );
  const projects = await getProjects();

  if (projects.length === 0) return <New />;

  return <Projects initialProjects={projects} />;
}
