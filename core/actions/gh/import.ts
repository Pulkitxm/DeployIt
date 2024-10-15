"use server";

import { ImportProjectType } from "@/types/project";
import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { generateSlug } from "@/lib/project";
import redis from "@/lib/redis";
import { getAccessTokenByEmail } from "@/db/user";

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

  if (redis) {
    console.log({
      ...importProject,
      GITHUB_TOKEN: accessToken,
    });
    await redis.lpush(
      "project_import_queue",
      JSON.stringify({
        ...importProject,
        GITHUB_TOKEN: accessToken,
        projectId: newProject.id,
        dbId: newProject.id,
      }),
    );
  }

  return {
    success: true,
    id: newProject.id,
  };
}
