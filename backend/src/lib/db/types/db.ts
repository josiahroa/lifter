import { createDbConnection } from "@/src/lib/db";

export type Db = ReturnType<typeof createDbConnection>;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
export type DbLike = Db | Tx;
