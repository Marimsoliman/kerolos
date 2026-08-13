// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import validator from "validator"; // ✅ أضف السطر ده
import dbConnect from "./mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("من فضلك أدخل البريد وكلمة المرور");
        }

        // ✅✅✅ هنا مكان الكود اللي سألت عليه ✅✅✅
        if (!validator.isEmail(credentials.email)) {
          throw new Error("صيغة البريد غير صحيحة");
        }

        const sanitizedEmail = validator.normalizeEmail(credentials.email);
        if (!sanitizedEmail) {
          throw new Error("صيغة البريد غير صحيحة");
        }
        // ✅✅✅ نهاية الكود ✅✅✅

        await dbConnect();
        const user = await User.findOne({ email: sanitizedEmail });

        if (!user || !user.password) {
          throw new Error("بيانات غير صحيحة");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("بيانات غير صحيحة"); // ✅ رسالة عامة أفضل أمنياً
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};