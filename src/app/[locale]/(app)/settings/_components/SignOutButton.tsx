"use client";

import { signout } from "@/features/auth/actions/auth";
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
import { routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { unregisterPushNotifications } from "@/features/notifications/service";

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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ListTile className="text-destructive" type="submit">
          <LogOut className="text-destructive mr-2" size={16} />
          {tSettingsPage("sign_out")}
        </ListTile>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {tSettingsPage("sign_out_modal_title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {tSettingsPage("sign_out_modal_description")}
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
