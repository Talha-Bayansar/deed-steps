import { db } from "@/db";
import { groupTable } from "@/db/schema";
import { getUser } from "@/features/auth/api";
import { routes } from "@/lib/routes";
import { eq } from "drizzle-orm";
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
  const group = await db
    .select()
    .from(groupTable)
    .where(eq(groupTable.id, Number(id)))
    .limit(1);
  const user = await getUser();

  if (group[0].ownerId !== user?.id)
    redirect(routes.groups.nameId(name, id).root);

  return children;
};

export default AdminLayout;
