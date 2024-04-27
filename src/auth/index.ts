import { Lucia } from "lucia";
import { adapter } from "@/db/schema";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      firstName: attributes.firstName,
      lastName: attributes.lastName,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    UserId: number;
  }
}

interface DatabaseUserAttributes {
  firstName: string;
  lastName: string;
}
