import CredentialsProvider from "next-auth/providers/credentials";// lib/auth.ts (TypeScript)
import GoogleProvider from "next-auth/providers/google"
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
                    return {
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        accessToken: data.token
                    };

                } else {
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",  // recomendado en App Router
    },
    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }

            (session as any).accessToken = token.accessToken;

            return session;
        },

        async signIn({ user, account, profile, email, credentials }) {
            if (account?.provider === "google") {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/external-login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        googleId: account.providerAccountId,
                    }),
                    headers: { "Content-Type": "application/json" }
                });


                if (!response.ok) {
                    return false;
                }

                const data = await response.json();

                if (data && data.user) {
                    user.id = data.user.id; // Asignar el ID del usuario retornado por el backend

                    return true;
                } else {
                    return false;
                }


            } else {
                return true;
            }
        }
    },

};