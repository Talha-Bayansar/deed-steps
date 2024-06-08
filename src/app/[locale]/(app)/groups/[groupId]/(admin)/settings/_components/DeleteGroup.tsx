"use client";
import { ListTile } from "@/components/ListTile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteGroup } from "@/features/groups/service";
import { routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";

import { useParams } from "next/navigation";
import { useRouter } from "@/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMyDeedTemplates } from "@/features/deeds/hooks/useMyDeedTemplates";
import { useMyGroups } from "@/features/groups/hooks/useMyGroups";
import { Trash2 } from "lucide-react";

export const DeleteGroup = () => {
  const t = useTranslations("global");
  const tGroupSettingsPage = useTranslations("GroupSettingsPage");
  const { groupId } = useParams<{ groupId: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { refetch: refetchMyDeedTemplates } = useMyDeedTemplates();
  const { refetch: refetchMyGroups } = useMyGroups();
  const mutation = useMutation({
    mutationFn: async () => await deleteGroup(Number(groupId)),
    onSuccess: async () => {
      await Promise.all([refetchMyDeedTemplates(), refetchMyGroups()]);
      setIsOpen(false);
      router.push(routes.groups.root);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <ListTile className="text-destructive">
          <Trash2 className="text-destructive mr-2" size={16} />
          {tGroupSettingsPage("delete_group")}
        </ListTile>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {tGroupSettingsPage("delete_group_modal_title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {tGroupSettingsPage("delete_group_modal_description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()}>
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
