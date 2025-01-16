"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { toast } from "sonner";
import { LoadingButton } from "@/components/loading-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { signOut } from "../api";
import { useTranslations } from "next-intl";

type Props = {
  children: React.ReactNode;
};

export const SignOutAlertDialog = ({ children }: Props) => {
  const t = useTranslations();
  const { executeAsync, isPending } = useAction(signOut);
  const router = useRouter();

  const handleClick = async () => {
    const response = await executeAsync();

    if (response?.data?.success) {
      router.push(routes.signIn.root);
    } else {
      toast.error(response?.data?.message);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full" asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-center sm:text-left">
          {t("signOutWarning")}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <LoadingButton
            onClick={handleClick}
            variant={"destructive"}
            isLoading={isPending}
          >
            {t("continue")}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
