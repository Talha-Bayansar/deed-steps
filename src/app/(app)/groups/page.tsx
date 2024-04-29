import { IconButton } from "@/components/IconButton";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { InvitationsBadge } from "@/groups/components/InvitationsBadge";
import { MyGroupsView } from "@/groups/components/MyGroupsView";
import { routes } from "@/lib/routes";
import { Inbox, Plus } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <Main>
      <div className="flex justify-between items-start">
        <Title>Groups</Title>
        <div className="flex items-start">
          <IconButton className="relative">
            <Link href={routes.groups.create.root}>
              <Inbox className="text-primary" />
            </Link>
            <InvitationsBadge />
          </IconButton>
          <IconButton>
            <Link href={routes.groups.create.root}>
              <Plus className="text-primary" />
            </Link>
          </IconButton>
        </div>
      </div>

      <MyGroupsView />
    </Main>
  );
};

export default Page;
