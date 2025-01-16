import { Logo } from "@/components/logo";
import { AuthForm } from "@/features/auth/containers/auth-form";
import { APP_NAME } from "@/lib/constants";
import { routes } from "@/lib/routes";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    email?: string;
    prefill?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Authentication",
  description: `Sign in to ${APP_NAME}`,
};

export default async function SignInPage({ searchParams }: Props) {
  const { email, prefill } = await searchParams;
  const t = await getTranslations();

  return (
    <div className="container mx-auto flex p-4 md:p-0 relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <Link href={routes.root} className="relative z-20 flex items-center">
          <Logo className="w-20 h-20" />
        </Link>
      </div>
      <div className="lg:p-8 flex flex-col items-center h-full justify-center relative">
        <div className="items-center flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("signIntoAccount")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("enterEmailToSignIn")}
            </p>
          </div>
          <AuthForm email={email} prefill={prefill} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            {t("signInToAgree")}{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t("termsOfService")}
            </Link>{" "}
            <span className="lowercase">{t("and")} </span>
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t("privacyPolicy")}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
