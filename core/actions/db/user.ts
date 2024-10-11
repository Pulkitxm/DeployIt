import { prisma } from "@/db";

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
