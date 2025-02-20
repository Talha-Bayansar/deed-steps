"use client";

import { ListTile } from "@/components/list-tile";
import { SignOutModal } from "@/features/auth/components/sign-out-modal";
import { useDisclosure } from "@heroui/react";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export const SignOutTile = () => {
  const t = useTranslations();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <>
      <ListTile onPress={onOpen} className="text-danger-400">
        <LogOut />
        {t("signOut")}
      </ListTile>
      <SignOutModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};
