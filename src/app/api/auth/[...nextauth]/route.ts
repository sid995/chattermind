import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  // session: {
  //   strategy: "jwt",
  // },
  callbacks: {
    session: async ({ session, token }: any) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug messages
  logger: {
    error: (code: any, metadata: any) => {
      console.error(code, metadata);
    },
    warn: (code: any) => {
      console.warn(code);
    },
    debug: (code: any, metadata: any) => {
      console.log(code, metadata);
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };