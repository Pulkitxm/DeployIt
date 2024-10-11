import { getProjects } from "@/actions/user/project";
import New from "@/app/new/page";
import Projects from "@/components/Dashboard/Projects";

export default async function Dashboard() {
  const projects = await getProjects();

  if (projects.length === 0) return <New />;

  return <Projects initialProjects={projects} />;
}
