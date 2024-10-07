import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
