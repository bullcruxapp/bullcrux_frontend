import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<string, string> | undefined) {
                const res = await fetch(API_URL + '/auth/login', {
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
        strategy: "jwt",
    },
    callbacks: {

        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.accessToken = (user as any).accessToken;
            }

            if (account?.provider === 'google') {
                const response = await fetch(API_URL + '/auth/external-login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: token.email,
                        name: token.name,
                        googleId: account.providerAccountId,
                    }),
                    headers: { "Content-Type": "application/json" }
                });

                if (response.ok) {
                    const data = await response.json();
                    token.accessToken = data.token;
                    token.id = data.user.id;
                }
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

        async signIn({ account }) {
            if (account?.provider === "google") {
                return true;
            }
            return true;
        }
    },
};
