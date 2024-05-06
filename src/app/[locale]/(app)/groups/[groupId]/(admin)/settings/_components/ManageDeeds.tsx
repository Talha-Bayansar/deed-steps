"use client";
import { ListTile } from "@/components/ListTile";
import { routes } from "@/lib/routes";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export const ManageDeeds = () => {
  const tGroupSettingsPage = useTranslations("GroupSettingsPage");
  const { groupId } = useParams<{ groupId: string }>();

  return (
    <Link href={routes.groups.id(groupId).deedTemplates.root}>
      <ListTile>{tGroupSettingsPage("manage_deeds")}</ListTile>
    </Link>
  );
};
