"use server";
import { db } from "@/db";
import { emailVerificationCodeTable, userTable } from "@/db/schema";
import { DrizzleError, and, eq } from "drizzle-orm";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { lucia } from ".";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Session, User } from "lucia";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import type { UserInsert } from "./models";
import { type Nullable } from "@/lib/utils";

export const sendEmail = async (email: string, verificationCode: string) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    /* 
          setting service as 'gmail' is same as providing these setings:
          host: "smtp.gmail.com",
          port: 465,
          secure: true
          If you want to use a different email provider other than gmail, you need to provide these manually.
          Or you can go use these well known services and their settings at
          https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
      */
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: "Verification Code",
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
  } catch (err) {
    return false;
  }
};

export async function generateEmailVerificationCode(
  email: string
): Promise<string> {
  await db
    .delete(emailVerificationCodeTable)
    .where(eq(emailVerificationCodeTable.email, email));
  const code = generateRandomString(8, alphabet("0-9"));
  await db.insert(emailVerificationCodeTable).values({
    email: email,
    code: code,
    expiresAt: createDate(new TimeSpan(15, "m")),
  });
  return code;
}

export async function sendEmailVerificationCode(email: string) {
  const code = await generateEmailVerificationCode(email);
  await sendEmail(email, code);
}

export async function signin(email: string, code: string) {
  const verificationCode = await db
    .select()
    .from(emailVerificationCodeTable)
    .where(
      and(
        eq(emailVerificationCodeTable.email, email),
        eq(emailVerificationCodeTable.code, code)
      )
    );
  if (verificationCode.length > 0) {
    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, verificationCode[0].email));

    if (user.length > 0) {
      const session = await lucia.createSession(user[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      await db
        .delete(emailVerificationCodeTable)
        .where(eq(emailVerificationCodeTable.id, verificationCode[0].id));
      return true;
    } else {
      const email = verificationCode[0].email;
      const name = email.split("@")[0].split(".");
      const newUser = await db
        .insert(userTable)
        .values({
          email: email.toLowerCase(),
          firstName: name[0],
          lastName: name[1],
        })
        .returning({ id: userTable.id });

      if (newUser.length > 0) {
        const session = await lucia.createSession(newUser[0].id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
        await db
          .delete(emailVerificationCodeTable)
          .where(eq(emailVerificationCodeTable.id, verificationCode[0].id));
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
    return result;
  }
);

export async function signout(): Promise<boolean> {
  const { session } = await validateRequest();
  if (!session) {
    return false;
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return true;
}

export async function updateUser(userDto: Nullable<UserInsert, "email">) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const updatedUser = await db
    .update(userTable)
    .set(userDto)
    .where(eq(userTable.id, user.id));

  return true;
}
