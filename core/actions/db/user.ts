"use server";

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
      status: true,
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
    select: {
      id: true,
      name: true,
      repoName: true,
      repoOwner: true,
      branch: true,
      updatedAt: true,
      slug: true,
      private: true,
      views: true,
      status: true,
    },
  });
  if (!project) return null;

  return project;
}

export async function getProjectLogs(projectId: string) {
  const logs = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      logs: true,
    },
  });
  if (!logs) return null;

  const parsedLogs = validateLogsZod.safeParse(logs.logs);
  if (!parsedLogs.success) return null;

  return parsedLogs.data;
}

export async function updateProject(
  projectId: string,
  values: {
    name: string;
    slug: string;
    private: boolean;
  },
) {
  const session = await getServerSession();
  if (!session) throw new Error("Session not found");

  const userId = await getUserIdByEmail(session.user.email);
  if (!userId) throw new Error("User not found");

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: values.name,
      slug: values.slug,
      private: values.private,
    },
  });

  return project;
}
