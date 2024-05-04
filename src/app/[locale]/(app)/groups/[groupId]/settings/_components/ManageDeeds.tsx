"use client";
import { ListTile } from "@/components/ListTile";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { useParams } from "next/navigation";

export const ManageDeeds = () => {
  const { groupId } = useParams<{ groupId: string }>();

  return (
    <Link href={routes.groups.id(groupId).deedTemplates.root}>
      <ListTile>Manage deeds</ListTile>
    </Link>
  );
};
