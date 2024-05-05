"use client";
import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { GenerateTransactionLinkForm } from "@/groups/components/GenerateTransactionLinkForm";
import { useTranslations } from "next-intl";

export const GenerateTransactionLink = () => {
  const t = useTranslations("TransactionPage");
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <ListTile>{t("generate_transaction_link")}</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8">
          <GenerateTransactionLinkForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
