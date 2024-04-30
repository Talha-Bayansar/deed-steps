import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { ChangeName } from "./_components/ChangeName";
import { DeleteGroup } from "./_components/DeleteGroup";
import { InviteUser } from "./_components/InviteUser";

const Page = () => {
  return (
    <Main>
      <Title>Settings</Title>
      <ChangeName />
      <InviteUser />
      <DeleteGroup />
    </Main>
  );
};

export default Page;
