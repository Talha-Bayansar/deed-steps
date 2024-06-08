import { MemberWrapper } from "@/features/groups/components/MemberWrapper";

type Props = {
  params: {
    groupId: string;
  };
  children: React.ReactNode;
};

const GroupLayout = ({ children, params: { groupId } }: Props) => {
  return <MemberWrapper groupId={groupId}>{children}</MemberWrapper>;
};

export default GroupLayout;
