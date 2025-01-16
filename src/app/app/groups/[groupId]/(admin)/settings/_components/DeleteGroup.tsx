"use client";
import { deleteGroup } from "@/features/groups/actions/groups";
import { routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";

import { useParams } from "next/navigation";
import { useRouter } from "@/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMyDeedTemplates } from "@/features/deeds/hooks/useMyDeedTemplates";
import { useMyGroups } from "@/features/groups/hooks/useMyGroups";
import { Trash2 } from "lucide-react";
import { DestructiveModalButton } from "@/components/DestructiveModalButton";

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
    <DestructiveModalButton
      open={isOpen}
      onOpenChange={setIsOpen}
      title={tGroupSettingsPage("delete_group_modal_title")}
      description={tGroupSettingsPage("delete_group_modal_description")}
      type="listTile"
      onContinue={() => mutation.mutate()}
      triggerChildren={
        <>
          <Trash2 className="text-destructive mr-2" size={16} />
          {tGroupSettingsPage("delete_group")}
        </>
      }
    />
  );
};
