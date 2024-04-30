import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { MyGroupInvitationsView } from "@/groups/components/MyGroupInvitationsView";

const Page = () => {
  return (
    <Main>
      <Title>Invitations</Title>
      <MyGroupInvitationsView />
    </Main>
  );
};

export default Page;
