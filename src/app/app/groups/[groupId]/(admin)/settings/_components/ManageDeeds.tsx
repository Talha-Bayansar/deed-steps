"use client";
import { ListTile } from "@/components/list-tile";
import { routes } from "@/lib/routes";
import { Link } from "@/navigation";
import { List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export const ManageDeeds = () => {
  const tGroupSettingsPage = useTranslations("GroupSettingsPage");
  const { groupId } = useParams<{ groupId: string }>();

  return (
    <Link href={routes.groups.id(groupId).deedTemplates.root}>
      <ListTile>
        <List className="text-primary mr-2" size={16} />
        {tGroupSettingsPage("manage_deeds")}
      </ListTile>
    </Link>
  );
};
