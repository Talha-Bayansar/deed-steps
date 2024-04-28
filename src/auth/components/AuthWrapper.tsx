"use server";
import { validateRequest } from "@/auth/service";
import { routes } from "@/lib/routes";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  children: JSX.Element;
};

export const AuthWrapper = ({ children }: Props) => {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthRequired>{children}</AuthRequired>
    </Suspense>
  );
};

const AuthLoading = () => {
  return (
    <div className="flex-grow grid place-items-center">
      <div className="p-6 flex flex-col items-center space-y-4 w-full max-w-md">
        <div className="flex flex-col items-center space-y-2">
          <h3 className="font-semibold text-lg">Authenticating</h3>
          <p className="text-sm text-gray-500">
            Please wait while we verify your credentials
          </p>
        </div>

        <Loader2 className="animate-spin" />
      </div>
    </div>
  );
};

const AuthRequired = async ({ children }: Props) => {
  const { user } = await validateRequest();

  if (!user) redirect(routes.signin.root);

  return children;
};
