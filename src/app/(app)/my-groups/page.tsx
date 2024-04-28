import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { MyGroupsView } from "@/groups/components/MyGroupsView";
import { Suspense } from "react";

const Page = () => {
  return (
    <Main>
      <Title>My Groups</Title>
      <Suspense fallback={<div>Loading groups...</div>}>
        <MyGroupsView />
      </Suspense>
    </Main>
  );
};

export default Page;
