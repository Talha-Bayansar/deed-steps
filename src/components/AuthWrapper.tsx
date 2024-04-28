"use server";
import { validateRequest } from "@/auth/service";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  children: JSX.Element;
};

export const AuthWrapper = ({ children }: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthRequired>{children}</AuthRequired>
    </Suspense>
  );
};

const AuthRequired = async ({ children }: Props) => {
  const { user } = await validateRequest();

  if (!user) redirect(routes.signin.root);

  return children;
};
