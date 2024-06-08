"use client";

import { useGroupById } from "@/features/groups/hooks/useGroupById";
import { routes } from "@/lib/routes";
import { useRouter } from "@/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  groupId: string;
  children: React.ReactNode;
};

export const AdminWrapper = ({ groupId, children }: Props) => {
  const router = useRouter();
  const { data: group, isLoading: isLoadingGroup } = useGroupById(groupId);

  if (isLoadingGroup) return <AdminLoading />;

  if (group?.isOwner) return children;

  router.push(routes.groups.root);
  return null;
};

const AdminLoading = () => {
  const t = useTranslations("AdminWrapper");

  return (
    <div className="flex-grow grid place-items-center">
      <div className="p-6 flex flex-col items-center space-y-4 w-full max-w-md">
        <div className="flex flex-col items-center space-y-2">
          <h3 className="font-semibold text-lg text-center">{t("title")}</h3>
          <p className="text-sm text-gray-500 text-center">
            {t("description")}
          </p>
        </div>

        <Loader2 className="animate-spin" />
      </div>
    </div>
  );
};
