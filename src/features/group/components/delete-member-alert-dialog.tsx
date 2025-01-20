"use client";

import { deleteUserFromGroup } from "@/features/group/api";
import { useState } from "react";
import { useTranslations } from "next-intl";
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
import { LoadingButton } from "@/components/loading-button";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  groupId: number;
  userId: number;
  children: React.ReactNode;
};

export const DeleteMemberAlertDialog = ({
  groupId,
  userId,
  children,
}: Props) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const { executeAsync, isPending } = useAction(deleteUserFromGroup);

  const handleDelete = async () => {
    const res = await executeAsync({
      userId,
      groupId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("deleteSuccess"));
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
          <AlertDialogDescription>{t("deleteWarning")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <LoadingButton
            onClick={handleDelete}
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
