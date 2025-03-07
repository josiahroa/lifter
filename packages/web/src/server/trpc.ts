import { initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";

// Context type definition
export async function createContext(opts: CreateNextContextOptions) {
  return {
    // Add any context you want available to all procedures
    // Example: session: await getSession(opts.req, opts.res),
  };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
