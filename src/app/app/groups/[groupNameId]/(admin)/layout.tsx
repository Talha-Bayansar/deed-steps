import { getMyUserToGroupByGroupId } from "@/features/user-to-group/api";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
  children: React.ReactNode;
};

const AdminLayout = async ({ params, children }: Props) => {
  const { groupNameId } = await params;

  const [name, id] = decodeURIComponent(groupNameId).split("_");

  const userToGroup = await getMyUserToGroupByGroupId(Number(id));
  if (!userToGroup.success) throw Error(userToGroup.message!);

  if (userToGroup.data!.role === "member")
    redirect(routes.groups.nameId(name, id).root);

  return children;
};

export default AdminLayout;
