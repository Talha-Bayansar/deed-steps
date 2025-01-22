"use client";

import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
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
import { deleteDeedStatusById } from "../api";

type Props = {
  deedStatusId: number;
  children: React.ReactNode;
};

export const DeleteDeedStatusAlertDialog = ({
  deedStatusId,
  children,
}: Props) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const deleteAction = useAction(deleteDeedStatusById);

  const handleDelete = async () => {
    const res = await deleteAction.executeAsync({ id: deedStatusId });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("deleteSuccess"));
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
          <AlertDialogDescription>{t("deleteWarning")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <LoadingButton
            onClick={handleDelete}
            variant={"destructive"}
            isLoading={deleteAction.isPending}
          >
            {t("continue")}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
