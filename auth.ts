import { db } from "@/database/drizzle";
import { compare } from "bcryptjs";
import { users } from "@/database/schema";
import { AuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials" // Import provider yang Anda butuhkan
import { eq } from "drizzle-orm";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔍 [Authorize] Cek user:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
            return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1)
        
        console.log("🔍 [Authorize] DB Result:", user.length > 0 ? "User Found" : "User Not Found");

        if (user.length === 0) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password.toString(), user[0].password);

        console.log("🔍 [Authorize] Password Valid?", isPasswordValid);

        if (!isPasswordValid) return null;

        console.log("✅ [Authorize] Login Sukses!");
        return {
            id: user[0].id.toString(),
            email: user[0].email,
            name: user[0].name,
            role: user[0].role
        } as User;

      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
        if(user) {
            token.id = user.id;
            token.name = user.name;
            token.role = user.role;
        }

        return token;
    },
    async session({ session, token }) {
      if(session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }

      return session;
    },
  },
}