import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import {
  MyGroupsView,
  MyGroupsViewSkeleton,
} from "@/groups/components/MyGroupsView";
import { Suspense } from "react";

const Page = () => {
  return (
    <Main>
      <Title>My Groups</Title>
      <Suspense fallback={<MyGroupsViewSkeleton />}>
        <MyGroupsView />
      </Suspense>
    </Main>
  );
};

export default Page;
