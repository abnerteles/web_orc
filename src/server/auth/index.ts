import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth = cache(uncachedAuth);

// Alias para compatibilidade
const getServerAuthSession = auth;

export { auth, handlers, signIn, signOut, getServerAuthSession };
