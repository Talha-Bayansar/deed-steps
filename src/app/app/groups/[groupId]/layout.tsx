import { MemberWrapper } from "@/features/group/components/MemberWrapper";

type Props = {
  params: Promise<{
    groupId: string;
  }>;
  children: React.ReactNode;
};

const GroupLayout = async (props: Props) => {
  const params = await props.params;

  const { groupId } = params;

  const { children } = props;

  return <MemberWrapper groupId={groupId}>{children}</MemberWrapper>;
};

export default GroupLayout;
