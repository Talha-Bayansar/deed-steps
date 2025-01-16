import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const dbClient = postgres(process.env.POSTGRES_URL!);

function singleton(
  name: string,
  value: ReturnType<typeof drizzle>
): ReturnType<typeof drizzle> {
  const globalAny: any = global;
  globalAny.__singletons = globalAny.__singletons || {};

  if (!globalAny.__singletons[name]) {
    globalAny.__singletons[name] = value;
  }

  return globalAny.__singletons[name];
}

export const db =
  process.env.NODE_ENV !== "production"
    ? singleton("db", drizzle(dbClient))
    : drizzle(dbClient);
