import { Header } from "@/components/layout/Heading";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { MyGroupInvitationsView } from "@/groups/components/MyGroupInvitationsView";

const Page = () => {
  return (
    <Main>
      <Header>
        <Title>Invitations</Title>
      </Header>
      <MyGroupInvitationsView />
    </Main>
  );
};

export default Page;
