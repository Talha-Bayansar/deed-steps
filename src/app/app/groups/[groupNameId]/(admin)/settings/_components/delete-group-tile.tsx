"use client";

import { deleteGroup } from "@/features/group/api";
import { routes } from "@/lib/routes";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
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
import { ListTile } from "@/components/list-tile";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  groupId: number;
};

export const DeleteGroupTile = ({ groupId }: Props) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { executeAsync, isPending } = useAction(deleteGroup);

  const handleDelete = async () => {
    const res = await executeAsync({
      id: groupId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess: () => {
        setIsOpen(false);
        router.push(routes.groups.root);
      },
      onError(message) {
        toast.error(message);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className="list-tile">
        <ListTile className="text-destructive">
          <Trash2 />
          {t("deleteGroup")}
        </ListTile>
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
