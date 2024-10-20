"use server";

import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { getUserIdByEmail } from "./user";
import { PROJECT_STATUS } from "@/types/project";
import { NEXT_PUBLIC_WEB_SERVER } from "@/lib/envVars";
import { getEvent, publishEvent } from "@/lib/redis";

export async function getPublicProjects() {
  const res = await getEvent("public_projects");
  console.log(res);
  if (res) {
    const publicProjects = JSON.parse(res) as {
      name: string;
      createdAt: Date;
      url: string;
    }[];
    console.log("Using cached public projects");
    return publicProjects.map((project) => ({
      ...project,
      createdAt: new Date(project.createdAt),
    }));
  }

  console.log("Fetching public projects");
  const projects = await prisma.project.findMany({
    where: {
      private: false,
      is_deleted: false,
      showOnHome: true,
      status: PROJECT_STATUS.BUILD_SUCCESS,
    },
    select: {
      name: true,
      createdAt: true,
      slug: true,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });
  const publicProjects = projects.map((project) => ({
    name: project.name,
    createdAt: project.createdAt,
    url: project.slug + "." + NEXT_PUBLIC_WEB_SERVER,
  }));

  try {
    await publishEvent(
      "public_projects",
      JSON.stringify(publicProjects),
      60 * 60,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
  }

  return publicProjects;
}

export async function getProjectStatus(projectId: string) {
  try {
    if (!projectId) return null;
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
        status: true,
      },
    });
    if (!project) return null;

    return project.status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

export async function getTotNoOPenProjects() {
  const res = await getEvent("projects_number");
  console.log(res);
  if (res) {
    return JSON.parse(res) as number;
  }

  const projectsNum = await prisma.project.count();
  try {
    await publishEvent("projects_number", JSON.stringify(projectsNum), 60 * 60);
    return projectsNum;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return projectsNum;
  }
}
