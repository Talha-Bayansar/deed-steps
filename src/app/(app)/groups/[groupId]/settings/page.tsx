import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { UpdateGroupForm } from "@/groups/components/UpdateGroupForm";
import React from "react";

type Props = {
  params: {
    groupId: string;
  };
};

const Page = ({ params: { groupId } }: Props) => {
  return (
    <Main>
      <Title>Settings</Title>
      <UpdateGroupForm groupId={groupId} />
    </Main>
  );
};

export default Page;
