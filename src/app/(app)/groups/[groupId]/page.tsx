import { Main } from "@/components/layout/Main";
import { GroupDetailsView } from "./_components/GroupDetailsView";

type Props = {
  params: {
    groupId: string;
  };
};

const Page = ({ params: { groupId } }: Props) => {
  return (
    <Main>
      <GroupDetailsView />
    </Main>
  );
};

export default Page;
