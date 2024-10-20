"use server";

import { ImportProjectType, PROJECT_STATUS } from "@/types/project";
import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { generateSlug } from "@/lib/project";
import { getAccessTokenByEmail } from "@/db/user";
import { leftPushEvent } from "@/lib/redis";

export async function importProject(importProject: ImportProjectType) {
  const session = await getServerSession();
  if (!session) {
    return {
      success: false,
      message: "Session not found",
    };
  }

  const accessToken = await getAccessTokenByEmail(session.user.email);
  const slug = generateSlug();

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

  const newProject = await prisma.project.create({
    data: {
      name: importProject.projectName,
      owner: {
        connect: {
          id: user.id,
        },
      },
      repoName: importProject.repoName,
      repoOwner: importProject.repoOwner,
      branch: importProject.branch,
      slug: slug,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: PROJECT_STATUS.BUILD_IN_QUEUE,
    },
  });

  await Promise.all(
    importProject.env.values.map(async (envVar) => {
      await prisma.envVar.create({
        data: {
          projectId: newProject.id,
          key: envVar.key,
          value: envVar.value,
        },
      });
    }),
  );

  try {
    await leftPushEvent(
      "project_queue",
      JSON.stringify({
        ...importProject,
        GITHUB_TOKEN: accessToken,
        projectId: newProject.id,
        dbId: newProject.id,
        OPERATION: "BUILD",
      }),
    );

    await prisma.project.update({
      where: {
        id: newProject.id,
      },
      data: {
        status: PROJECT_STATUS.BUILD_IN_QUEUE,
      },
    });
    return {
      success: true,
      id: newProject.id,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    await prisma.project.update({
      where: {
        id: newProject.id,
      },
      data: {
        status: PROJECT_STATUS.BUILD_FAILED,
      },
    });
    return {
      success: false,
      message: "Failed to import project",
    };
  }
}
