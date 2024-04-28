import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { GroupForm } from "@/groups/components/GroupForm";

const Page = () => {
  return (
    <Main>
      <Title>Create group</Title>
      <GroupForm />
    </Main>
  );
};

export default Page;
