"use client";

import { useTranslations } from "next-intl";
import { manageUserSubscription } from "../api";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@heroui/button";

export const ManageSubscriptionButton = () => {
  const t = useTranslations();
  const { executeAsync, isPending } = useAction(manageUserSubscription);

  const handleClick = async () => {
    const res = await executeAsync();
    handleResponse({
      response: res?.data,
      t,
      onSuccess: () => {
        window.location.href = res!.data!.data!.url;
      },
      onError: (message) => {
        toast.error(message);
      },
    });
  };

  return (
    <Button
      className="w-full sm:w-auto"
      onPress={handleClick}
      isLoading={isPending}
      variant={"bordered"}
    >
      {t("manageSubscription")}
    </Button>
  );
};
