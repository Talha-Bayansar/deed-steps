"use client";

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
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { promoteToAdmin } from "../api";
import { useState } from "react";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  children: React.ReactNode;
  userId: number;
  groupId: number;
};

export const PromoteToAdminAlertDialog = ({
  children,
  userId,
  groupId,
}: Props) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const { executeAsync, isPending } = useAction(promoteToAdmin);

  const handleClick = async () => {
    const res = await executeAsync({
      groupId,
      userId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("promoteSuccess"));
        setIsOpen(false);
      },
      onError(message) {
        toast.error(message);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("promoteToAdminWarning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <LoadingButton onClick={handleClick} isLoading={isPending}>
            {t("continue")}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
