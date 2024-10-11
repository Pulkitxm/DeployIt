import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { getUserIdByEmail } from "@/actions/db/user";

export async function getProjects() {
  const session = await getServerSession();
  if (!session) throw new Error("Session not found");

  console.log(session);

  const userId = getUserIdByEmail(session.user.email);
  if (!userId) throw new Error("User not found");

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return [...projects].map((project) => ({
    id: project.id,
    name: project.name,
    slug: project.slug,
    repoName: project.repoName,
    repoOwner: project.repoOwner,
    branch: project.branch,
    logs: project.logs,
    updatedAt: project.updatedAt,
  }));
}
