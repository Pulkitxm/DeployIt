import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      github_id: number;
      name: string;
      email: string;
      bio?: string;
      avatar_url?: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    github_id: number;
    name: string;
    email: string;
    bio?: string;
    avatar_url?: string;
    username: string;
  }

  interface Profile {
    id?: string;
    name?: string;
    email?: string;
    avatar_url?: string;
    bio?: string;
    login?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    github_id: number;
    name: string;
    email: string;
    bio?: string;
    avatar_url?: string;
    username: string;
  }
}
