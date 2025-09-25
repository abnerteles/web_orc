import NextAuth, { type NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import { cache } from "react";

import { authConfig } from "./config";

// NextAuth v4 configuration
export default NextAuth(authConfig as NextAuthOptions);

// For API routes
export const handlers = NextAuth(authConfig as NextAuthOptions);

// Server-side auth function
const auth = cache(() => getServerSession(authConfig as NextAuthOptions));

// Alias para compatibilidade
const getServerAuthSession = auth;

export { auth, getServerAuthSession };
