import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { CreateGroupForm } from "@/groups/components/CreateGroupForm";

const Page = () => {
  return (
    <Main>
      <Title>Create group</Title>
      <CreateGroupForm />
    </Main>
  );
};

export default Page;
