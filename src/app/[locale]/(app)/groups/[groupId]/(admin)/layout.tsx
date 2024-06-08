import { AdminWrapper } from "@/features/groups/components/AdminWrapper";

type Props = {
  params: {
    groupId: string;
  };
  children: React.ReactNode;
};

const AdminLayout = ({ params: { groupId }, children }: Props) => {
  return <AdminWrapper groupId={groupId}>{children}</AdminWrapper>;
};

export default AdminLayout;
