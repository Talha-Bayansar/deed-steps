import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

const client = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, {
  schema: schema,
});

export const adapter = new DrizzleSQLiteAdapter(
  db,
  schema.sessionTable,
  schema.userTable
);
