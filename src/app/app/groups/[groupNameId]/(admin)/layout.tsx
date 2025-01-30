import { getUser } from "@/features/auth/api";
import { getGroupAdminsByGroupId } from "@/features/group-admin/api";
import { getGroupById } from "@/features/group/api";
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
  const user = await getUser();

  if (!user) redirect(routes.signIn.root);

  const groupAdmins = await getGroupAdminsByGroupId(Number(id));
  if (!groupAdmins.success) throw Error(groupAdmins.message!);

  const group = await getGroupById(Number(id));
  if (!group.success) throw Error(group.message!);

  const hasPermission =
    group.data!.ownerId === user.id ||
    !!groupAdmins.data!.find((ga) => ga.userId === user.id);

  if (!hasPermission) redirect(routes.groups.nameId(name, id).root);

  return children;
};

export default AdminLayout;
