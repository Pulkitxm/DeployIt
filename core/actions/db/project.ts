"use server";

import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { getUserIdByEmail } from "./user";

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
