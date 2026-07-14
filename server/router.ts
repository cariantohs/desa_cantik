import { authRouter } from "./auth-router.js";
import { desaRouter } from "./desa-router.js";
import { sotkRouter } from "./sotk-router.js";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { sql } from "drizzle-orm";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  keepalive: publicQuery.query(async () => {
    // Touch the database so Aiven doesn't close idle connections
    const db = getDb();
    await db.execute(sql`SELECT 1`);
    return { ok: true, ts: Date.now() };
  }),
  auth: authRouter,
  desa: desaRouter,
  sotk: sotkRouter,
});

export type AppRouter = typeof appRouter;

