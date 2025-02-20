"use client";

import { ListTile } from "@/components/list-tile";
import { routes } from "@/lib/routes";
import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const MySubscriptionTile = () => {
  const t = useTranslations();

  return (
    <ListTile as={Link} href={routes.mySubscription.root}>
      <CreditCard className="text-primary" />
      {t("mySubscription")}
    </ListTile>
  );
};
