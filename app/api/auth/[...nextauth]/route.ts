import NextAuth from "next-auth"
import { authOptions } from "@/auth" // <-- Import konfigurasi tadi

const handler = NextAuth(authOptions) // <-- Disini baru NextAuth dijalankan

export { handler as GET, handler as POST }