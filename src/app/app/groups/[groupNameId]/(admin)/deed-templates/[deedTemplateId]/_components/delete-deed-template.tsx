"use client";

import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { deleteDeedTemplateById } from "@/features/deed-template/api";
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
import { Button } from "@/components/ui/button";

type Props = {
  deedTemplateId: number;
  groupId: number;
  groupName: string;
};

export const DeleteDeedTemplate = ({
  deedTemplateId,
  groupId,
  groupName,
}: Props) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { executeAsync, isPending } = useAction(deleteDeedTemplateById);

  const handleDelete = async () => {
    const res = await executeAsync({
      id: deedTemplateId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess: () => {
        toast.success(t("deleteSuccess"));
        router.push(
          routes.groups.nameId(groupName, groupId).deedTemplates.root
        );
      },
      onError(message) {
        toast.error(message);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>{t("deleteDeedTemplate")}</Button>
      </AlertDialogTrigger>
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
