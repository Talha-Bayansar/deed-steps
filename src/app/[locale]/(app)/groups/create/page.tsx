import { Header } from "@/components/layout/Heading";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { CreateGroupForm } from "@/groups/components/CreateGroupForm";

const Page = () => {
  return (
    <Main>
      <Header>
        <Title>Create group</Title>
      </Header>
      <CreateGroupForm />
    </Main>
  );
};

export default Page;
