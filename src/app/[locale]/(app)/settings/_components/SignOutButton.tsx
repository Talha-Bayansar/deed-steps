"use client";

import { signout } from "@/features/auth/actions/auth";
import { routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { unregisterPushNotifications } from "@/features/notifications/services/notifications";
import { DestructiveModalButton } from "@/components/DestructiveModalButton";

export const SignOutButton = () => {
  const t = useTranslations("global");
  const tSettingsPage = useTranslations("SettingsPage");
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => await unregisterPushNotifications(),
    onSuccess: async () => {
      await signout();
      router.push(routes.signin.root);
    },
  });

  return (
    <DestructiveModalButton
      title={tSettingsPage("sign_out_modal_title")}
      description={tSettingsPage("sign_out_modal_description")}
      type="listTile"
      onContinue={() => mutation.mutate()}
      triggerChildren={
        <>
          <LogOut className="text-destructive mr-2" size={16} />
          {tSettingsPage("sign_out")}
        </>
      }
    />
  );
};
