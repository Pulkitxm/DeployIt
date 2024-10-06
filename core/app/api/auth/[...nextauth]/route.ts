import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const GITHUB_ID = process.env.GITHUB_ID ?? "";
const GITHUB_SECRET = process.env.GITHUB_SECRET ?? "";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
};

export const GET = NextAuth(authOptions);

export const POST = NextAuth(authOptions);