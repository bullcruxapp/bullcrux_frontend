import CredentialsProvider from "next-auth/providers/credentials";// lib/auth.ts (TypeScript)
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<string, string> | undefined) {
                const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    }),
                    headers: { "Content-Type": "application/json" }
                });
                const data = await res.json();

                if (res.ok && data) {
                    return data.user;
                } else {
                    return null;
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",  // recomendado en App Router
    },
    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // guardamos ID del usuario
            }
            return token;
        },
    },

};