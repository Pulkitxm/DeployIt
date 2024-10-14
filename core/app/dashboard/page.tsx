import { getProjects } from "@/actions/db/user";
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

  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  try {
    projects = await getProjects();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.message === "User not found") {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <ProtectRouteUI />
        </div>
      );
    }
  }

  if (projects.length === 0) return <New />;

  return <Projects initialProjects={projects} />;
}
