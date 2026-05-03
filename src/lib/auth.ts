import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        password: { label: "Passord", type: "password" },
      },
      async authorize(credentials) {
        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!hash || !credentials?.password) return null;
        const ok = await bcrypt.compare(credentials.password, hash);
        if (!ok) return null;
        return { id: "1", name: "Leon", email: "leon@uvesentlig.no" };
      },
    }),
  ],
  pages: {
    signIn: "/admin/logg-inn",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
