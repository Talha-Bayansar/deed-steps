import { hasGroupPermission } from "@/features/user-to-group/access-control/permissions";
import { getMyUserToGroupByGroupId } from "@/features/user-to-group/api";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
  children: React.ReactNode;
};

const DeedTemplatesLayout = async ({ params, children }: Props) => {
  const { groupNameId } = await params;

  const [name, id] = decodeURIComponent(groupNameId).split("_");

  const userToGroup = await getMyUserToGroupByGroupId(Number(id));
  if (!userToGroup.success) throw Error(userToGroup.message!);

  if (!hasGroupPermission(userToGroup.data!, "deedTemplate:edit"))
    redirect(routes.groups.nameId(name, id).root);

  return children;
};

export default DeedTemplatesLayout;
