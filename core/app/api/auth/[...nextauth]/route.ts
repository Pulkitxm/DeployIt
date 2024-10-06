import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const GITHUB_ID = process.env.GITHUB_ID ?? "";
const GITHUB_SECRET = process.env.GITHUB_SECRET ?? "";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "null",
    signOut: "null",
    error: "null",
    verifyRequest: "null",
    newUser: "null",
  },
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      authorization: {
        params: {
          scope: "repo read:user user:email",
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
        id: profile?.id,
        access_token: account?.access_token,
      };
      for (const entry of Object.keys(db_data)) {
        if (!db_data[entry as keyof typeof db_data]) {
          return false;
        }
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

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
