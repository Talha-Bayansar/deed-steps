"use server";

import { and, eq } from "drizzle-orm";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  emailVerificationCodeTable,
  sessionTable,
  userTable,
} from "@/db/schema";
import { db } from "@/db";
import { cookies } from "next/headers";
import { cache } from "react";
import { routes } from "@/lib/routes";
import { generateRandomString, alphabet } from "oslo/crypto";
import { TimeSpan, createDate } from "oslo";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { z } from "zod";
import { safeAction } from "@/lib/safe-action";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Session, User } from "./types";
import { findUserBySessionId } from "./queries";

async function generateSessionToken() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(userId: number): Promise<Session> {
  const token = await generateSessionToken();
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await db.insert(sessionTable).values(session);
  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = token;
  const result = await findUserBySessionId(sessionId);

  if (!result) {
    return { session: null, user: null };
  }
  const { user, session } = result;
  const expiresAtTime = new Date(session.expiresAt).getTime();

  if (Date.now() >= expiresAtTime) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= expiresAtTime - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionTable.id, session.id));
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function setSessionTokenCookie(token: string) {
  (await cookies()).set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  (await cookies()).set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = (await cookies()).get("session")?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await validateSessionToken(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.expiresAt > new Date()) {
        await setSessionTokenCookie(result.session.id);
      }
      if (!result.session) {
        deleteSessionTokenCookie();
      }
    } catch {}
    return result;
  }
);

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export const getUser = cache(async () => {
  const sessionId = (await cookies()).get("session")?.value ?? null;
  if (!sessionId) {
    return null;
  }

  const result = await validateSessionToken(sessionId);
  return result.user;
});

export const requireAuth = async () => {
  const { user } = await validateRequest();
  if (!user) {
    redirect(routes.signIn.root);
  }

  return user;
};

const sendEmail = async (email: string, verificationCode: string) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const t = await getTranslations();

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: t("verificationCode"),
    text: verificationCode,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return true;
  } catch {
    return false;
  }
};

async function generateEmailVerificationCode(email: string): Promise<string> {
  await db
    .delete(emailVerificationCodeTable)
    .where(eq(emailVerificationCodeTable.email, email.toLowerCase()));
  const code = generateRandomString(8, alphabet("0-9"));
  await db.insert(emailVerificationCodeTable).values({
    email: email.toLowerCase(),
    code: code,
    expiresAt: createDate(new TimeSpan(15, "m")),
  });
  return code;
}

const emailSchema = async () => {
  const t = await getTranslations();

  return z.object({
    email: z
      .string({
        required_error: t("validations.required", { field: t("email") }),
      })
      .email(t("validations.email"))
      .min(1, t("validations.minLength", { field: t("email"), length: "1" })),
  });
};

export const sendEmailVerificationCode = safeAction
  .schema(emailSchema)
  .action(async ({ parsedInput: { email } }) => {
    const t = await getTranslations();
    try {
      const code = await generateEmailVerificationCode(email.toLowerCase());
      await sendEmail(email.toLowerCase(), code);
      return createSuccessResponse();
    } catch (error) {
      console.error(error);
      return createErrorResponse(t("sendVerificationCodeSuccess"));
    }
  });

const signinSchema = async () => {
  const t = await getTranslations();

  return z.object({
    email: z
      .string({
        required_error: t("validations.required", { field: t("email") }),
      })
      .email(t("validations.email"))
      .min(1, t("validations.minLength", { field: t("email"), length: "1" })),
    code: z
      .string({
        required_error: t("validations.required", {
          field: t("verificationCode"),
        }),
      })
      .min(
        8,
        t("validations.minLength", {
          field: t("verificationCode"),
          length: "8",
        })
      )
      .max(
        8,
        t("validations.maxLength", {
          field: t("verificationCode"),
          length: "8",
        })
      ),
  });
};

export const signin = safeAction
  .schema(signinSchema)
  .action(async ({ parsedInput: { email, code } }) => {
    const t = await getTranslations();
    try {
      console.log("Email", email);
      console.log("Code", code);
      const verificationCode = await db
        .select()
        .from(emailVerificationCodeTable)
        .where(
          and(
            eq(emailVerificationCodeTable.email, email),
            eq(emailVerificationCodeTable.code, code)
          )
        );

      console.log("Verification code", verificationCode);

      if (verificationCode.length > 0) {
        const user = await db
          .select()
          .from(userTable)
          .where(eq(userTable.email, verificationCode[0].email!));

        if (user.length > 0) {
          console.log("User exists", user[0].email);
          const session = await createSession(user[0].id);

          setSessionTokenCookie(session.id);
          await db
            .delete(emailVerificationCodeTable)
            .where(eq(emailVerificationCodeTable.id, verificationCode[0].id));
          return createSuccessResponse();
        } else {
          const email = verificationCode[0].email!;
          const name = email.split("@")[0].split(".");
          console.log("Creating new user");

          const newUser = await db
            .insert(userTable)
            .values({
              email: email.toLowerCase(),
              firstName: name?.[0] ?? "",
              lastName: name?.[1] ?? "",
            })
            .returning({ id: userTable.id });

          console.log("Created new user", email);

          if (newUser.length > 0) {
            const session = await createSession(newUser[0].id);

            setSessionTokenCookie(session.id);

            const response = await db
              .delete(emailVerificationCodeTable)
              .where(eq(emailVerificationCodeTable.id, verificationCode[0].id));

            return createSuccessResponse(response);
          } else {
            console.log("Failed to create user", email);
            return createErrorResponse(t("signInError"));
          }
        }
      } else {
        return createErrorResponse(t("signInError"));
      }
    } catch (error) {
      console.error(error);
      return createErrorResponse(t("signInError"));
    }
  });

export const signOut = safeAction.action(async () => {
  const t = await getTranslations();
  const { session } = await validateRequest();
  if (!session) {
    return createErrorResponse(t("signOutError"));
  }

  await invalidateSession(session.id);

  deleteSessionTokenCookie();
  return createSuccessResponse();
});

export const updateUserName = safeAction
  .schema(
    z.object({
      firstName: z.string().min(1).max(50),
      lastName: z.string().min(1).max(50),
    })
  )
  .action(async ({ parsedInput: { firstName, lastName } }) => {
    const t = await getTranslations();
    const user = await requireAuth();

    try {
      const res = await db
        .update(userTable)
        .set({
          firstName,
          lastName,
        })
        .where(eq(userTable.id, user.id));

      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
