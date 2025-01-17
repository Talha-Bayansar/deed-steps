"use client";

import { ListTile } from "@/components/list-tile";
import { SignOutAlertDialog } from "@/features/auth/components/sign-out-alert-dialog";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export const SignOutTile = () => {
  const t = useTranslations();

  return (
    <SignOutAlertDialog>
      <button>
        <ListTile className="text-destructive">
          <LogOut />
          {t("signOut")}
        </ListTile>
      </button>
    </SignOutAlertDialog>
  );
};
