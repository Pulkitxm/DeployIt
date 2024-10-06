import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
  }

  interface Profile {
    bio: string;
    avatar_url: string;
    id: string;
  }

  interface Session {
    user: User & {
      bio?: string;
      avatar_url?: string;
    };
  }
}
