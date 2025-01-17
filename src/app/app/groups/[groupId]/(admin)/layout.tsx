import { AdminWrapper } from "@/features/group/components/AdminWrapper";

type Props = {
  params: Promise<{
    groupId: string;
  }>;
  children: React.ReactNode;
};

const AdminLayout = async (props: Props) => {
  const params = await props.params;

  const { groupId } = params;

  const { children } = props;

  return <AdminWrapper groupId={groupId}>{children}</AdminWrapper>;
};

export default AdminLayout;
