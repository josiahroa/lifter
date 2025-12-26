import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { users } from "../schema/auth";

export const userSelectSchema = createSelectSchema(users);

export type User = z.infer<typeof userSelectSchema>;
