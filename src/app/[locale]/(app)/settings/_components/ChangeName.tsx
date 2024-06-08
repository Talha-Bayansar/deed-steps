"use client";

import { UserForm } from "@/features/auth/components/UserForm";
import { useSession } from "@/features/auth/hooks/useSession";
import type { UserInsert } from "@/features/auth/models";
import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { type Nullable } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Pen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { updateUser } from "@/features/auth/actions/users";

export const ChangeName = () => {
  const t = useTranslations("SettingsPage");
  const { data, refetch } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: async (userDto: Nullable<UserInsert, "email">) =>
      await updateUser(userDto),
    onSuccess: async () => {
      await refetch();
      toast.success(t("change_name_success"));
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile>
          <Pen className="text-primary mr-2" size={16} />
          {t("change_name")}
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8 overflow-y-scroll">
          <UserForm
            user={data!.user!}
            onSubmit={(values) => mutation.mutate(values)}
            isLoading={mutation.isPending}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
