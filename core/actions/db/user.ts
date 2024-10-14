import { prisma } from "@/db";
import { validateLogsZod } from "@/types/project";
import { getServerSession } from "next-auth";

export async function getUserIdByEmail(email: string) {
  if (!email) return undefined;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    return user?.id;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function getProjects() {
  const session = await getServerSession();
  if (!session) throw new Error("Session not found");

  const userId = await getUserIdByEmail(session.user.email);
  if (!userId) throw new Error("User not found");

  const projects = await prisma.project.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      repoName: true,
      repoOwner: true,
      branch: true,
      updatedAt: true,
      slug: true,
    },
  });

  return projects;
}

export async function getProjectDetails(projectId: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Session not found");

  const userId = await getUserIdByEmail(session.user.email);
  if (!userId) throw new Error("User not found");

  const project = await prisma.project.findFirst({
    where: {
      userId,
      id: projectId,
    },
  });
  if (!project) return null;

  const validateLogs = validateLogsZod.safeParse(project.logs);
  if (validateLogs.success)
    return {
      ...project,
      logs: validateLogs.data,
    };
  return {
    ...project,
    logs: [],
  };
}
