"use client";
import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { GenerateTransactionLinkForm } from "@/groups/components/GenerateTransactionLinkForm";
import { Link } from "lucide-react";
import { useTranslations } from "next-intl";

export const GenerateTransactionLink = () => {
  const t = useTranslations("TransactionPage");
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <ListTile>
          <Link className="text-primary mr-2" size={16} />
          {t("generate_transaction_link")}
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8 overflow-y-scroll">
          <GenerateTransactionLinkForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
