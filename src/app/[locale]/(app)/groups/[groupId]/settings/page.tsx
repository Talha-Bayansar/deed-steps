import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { ChangeName } from "./_components/ChangeName";
import { DeleteGroup } from "./_components/DeleteGroup";
import { InviteUser } from "./_components/InviteUser";
import { ManageDeeds } from "./_components/ManageDeeds";
import { Header } from "@/components/layout/Heading";

const Page = () => {
  return (
    <Main>
      <Header>
        <Title>Settings</Title>
      </Header>
      <ChangeName />
      <InviteUser />
      <ManageDeeds />
      <DeleteGroup />
    </Main>
  );
};

export default Page;
