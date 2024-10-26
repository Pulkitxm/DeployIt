"use server";

import { prisma } from "@/db";
import { leftPushEvent } from "@/lib/redis";
import { PROJECT_STATUS } from "@/types/project";
import { getServerSession } from "next-auth";

export async function deleteProject(projectId: string) {
  const session = await getServerSession();
  if (!session) {
    return {
      success: false,
      message: "Session not found",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId: user.id,
      is_deleted: false,
    },
  });
  if (!project) {
    return {
      success: false,
      message: "Project not found",
    };
  }

  await leftPushEvent(
    "project_queue",
    JSON.stringify({
      projectId,
      OPERATION: "DELETE",
    }),
  );

  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      status: PROJECT_STATUS.DELETE_IN_QUEUE,
    },
  });

  return {
    success: true,
    message: "Project deletion is in progress",
  };
}
