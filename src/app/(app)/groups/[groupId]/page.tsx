import { Main } from "@/components/layout/Main";
import { GroupDetailsView } from "@/groups/components/GroupDetailsView";

type Props = {
  params: {
    groupId: string;
  };
};

const Page = ({ params: { groupId } }: Props) => {
  return (
    <Main>
      <GroupDetailsView groupId={groupId} />
    </Main>
  );
};

export default Page;
