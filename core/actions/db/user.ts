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
      is_deleted: false,
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
      showOnHome: true,
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
      is_deleted: false,
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
      showOnHome: true,
    },
  });
  if (!project) return null;

  return project;
}

export async function getProjectLogs(projectId: string) {
  const logs = await prisma.project.findUnique({
    where: {
      id: projectId,
      is_deleted: false,
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
    showOnHome: boolean;
  },
) {
  const session = await getServerSession();
  if (!session) throw new Error("Session not found");

  const userId = await getUserIdByEmail(session.user.email);
  if (!userId) throw new Error("User not found");

  const slugPattern = /^[a-zA-Z0-9\-]+$/;
  if (!slugPattern.test(values.slug))
    throw new Error(
      "Invalid slug: only alphanumeric characters and hyphens are allowed",
    );

  const project = await prisma.project.update({
    where: {
      id: projectId,
      is_deleted: false,
    },
    data: {
      name: values.name,
      slug: values.slug,
      private: values.private,
      showOnHome: values.showOnHome,
    },
  });

  return project;
}
