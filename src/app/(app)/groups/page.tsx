import { IconButton } from "@/components/IconButton";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { MyGroupsView } from "@/groups/components/MyGroupsView";
import { routes } from "@/lib/routes";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const Page = () => {
  return (
    <Main>
      <div className="flex justify-between items-start">
        <Title>Groups</Title>
        <IconButton>
          <Link href={routes.groups.create.root}>
            <Plus className="text-primary" />
          </Link>
        </IconButton>
      </div>

      <MyGroupsView />
    </Main>
  );
};

export default Page;
