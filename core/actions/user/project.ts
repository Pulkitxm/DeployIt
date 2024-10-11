import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { getUserIdByEmail } from "@/actions/db/user";

export async function getProjects() {
  const session = await getServerSession();
  if (!session) throw new Error("Session not found");

  const userId = await getUserIdByEmail(session.user.email);
  if (!userId) throw new Error("User not found");

  const projects = await prisma.project.findMany({
    where: {
      userId,
    },
  });

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    repoName: project.repoName,
    repoOwner: project.repoOwner,
    branch: project.branch,
    updatedAt: project.updatedAt,
  }));
}

export async function getProjectDetails(projectName: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Session not found");

  const userId = await getUserIdByEmail(session.user.email);
  if (!userId) throw new Error("User not found");

  const project = await prisma.project.findFirst({
    where: {
      userId,
      name: projectName,
    },
  });
  if (!project) return null;
  return project;
}
