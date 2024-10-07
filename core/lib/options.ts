import { prisma } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const GITHUB_ID = process.env.GITHUB_ID ?? "";
const GITHUB_SECRET = process.env.GITHUB_SECRET ?? "";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user repo user:email",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const db_data = {
        name: profile?.name,
        email: user?.email,
        avatar_url: profile?.avatar_url,
        bio: profile?.bio,
        id: parseInt(profile?.id ?? ""),
        access_token: account?.access_token,
      };

      if (!db_data.name) {
        db_data.name = db_data.email?.split("@")[0];
      }

      const nonNullableFiels: (keyof typeof db_data)[] = [
        "name",
        "email",
        "avatar_url",
        "id",
        "access_token",
      ];
      for (const field of nonNullableFiels) {
        if (!db_data[field]) {
          return false;
        }
      }
      try {
        // await prisma.user.create({
        //   data: {
        //     access_token: db_data.access_token!,
        //     avatar: db_data.avatar_url!,
        //     bio: db_data.bio!,
        //     email: db_data.email!,
        //     github_id: db_data.id!,
        //     name: db_data.name!,
        //   },
        // });

        const res = await prisma.user.upsert({
          where: {
            github_id: db_data.id!,
          },
          create: {
            access_token: db_data.access_token!,
            avatar: db_data.avatar_url!,
            bio: db_data.bio!,
            email: db_data.email!,
            github_id: db_data.id!,
            name: db_data.name!,
          },
          update: {
            access_token: db_data.access_token!,
            avatar: db_data.avatar_url!,
            bio: db_data.bio!,
            email: db_data.email!,
            github_id: db_data.id!,
            name: db_data.name!,
          },
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }

      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.bio = token.bio as string | undefined;
        session.user.avatar_url = token.avatar_url as string | undefined;
      }
      return session;
    },

    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.bio = profile?.bio as string | undefined;
        token.avatar_url = profile?.avatar_url as string | undefined;
        token.name = user.name;
      }
      return token;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXT_AUTH_SECRET,
};
