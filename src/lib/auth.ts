import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
                    const result = {
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        accessToken: data.token
                    };
                    return result;
                }
                return null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
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

                if (!response.ok) return false;

                const data = await response.json();

                if (data?.user) {
                    user.id = data.user.id;
                    user.accessToken = data.token; // ← esto faltaba
                    return true;
                }

                return false;
            }

            return true;
        },

        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.accessToken = user.accessToken; // ← ahora llega correctamente
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id;
            session.accessToken = token.accessToken;
            return session;
        },
    },
};