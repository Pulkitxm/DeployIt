import { prisma } from "../db";

export async function getAccessToken(github_id: number) {
  const user = await prisma.user.findUnique({ where: { github_id } });
  return user?.access_token;
}
