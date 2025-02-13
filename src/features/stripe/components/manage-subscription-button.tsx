"use client";

import { LoadingButton } from "@/components/loading-button";
import { useTranslations } from "next-intl";
import { manageUserSubscription } from "../api";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";

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
    <LoadingButton onClick={handleClick} isLoading={isPending}>
      {t("manageSubscription")}
    </LoadingButton>
  );
};
