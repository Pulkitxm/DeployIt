import { prisma } from "@/db";
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
      if (!profile || !account) return false;

      const github_id = profile.id ? parseInt(profile.id) : 0;
      if (!github_id) return false;

      const db_data = {
        github_id,
        name: profile.name ?? user.name ?? profile.login ?? "",
        email: user.email ?? "",
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        access_token: account.access_token ?? "",
        username: profile.login ?? "",
      };

      if (
        !db_data.name ||
        !db_data.email ||
        !db_data.access_token ||
        !db_data.username
      ) {
        return false;
      }

      const upsertedUser = await prisma.user.upsert({
        where: { github_id: db_data.github_id },
        create: {
          github_id: db_data.github_id,
          access_token: db_data.access_token,
          avatar: db_data.avatar_url ?? "",
          bio: db_data.bio ?? "",
          email: db_data.email,
          name: db_data.name,
          github_username: db_data.username,
        },
        update: {
          access_token: db_data.access_token,
          avatar: db_data.avatar_url,
          bio: db_data.bio,
          email: db_data.email,
          name: db_data.name,
          github_username: db_data.username,
        },
      });

      user.id = upsertedUser.id;
      user.github_id = upsertedUser.github_id;

      return true;
    },

    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.github_id = user.github_id;
        token.name = user.name;
        token.email = user.email;
        token.username = ((profile?.login as string) ?? "").toLowerCase();
      }
      if (profile) {
        token.bio = profile.bio as string | undefined;
        token.avatar_url = profile.avatar_url as string | undefined;
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          github_id: token.github_id,
          name: token.name,
          email: token.email,
          bio: token.bio,
          avatar_url: token.avatar_url,
          username: token.username,
        },
      };
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXT_AUTH_SECRET,
};
