import { getGroupDetailsById } from "@/features/group/api";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ErrorState } from "@/components/error-state";
import { GroupDetailsView } from "./_components/group-details-view";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const GroupDetailsPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const t = await getTranslations();
  const id = decodeURIComponent(groupNameId).split("_")[1];
  const groupDetails = await getGroupDetailsById(Number(id));

  const error = extractError(groupDetails, t);
  if (error) return <ErrorState error={error} />;

  return (
    <GroupDetailsView
      group={groupDetails.data!.group}
      members={groupDetails.data!.groupMembers}
      points={groupDetails.data!.groupPoints}
      isOwner={groupDetails.data!.isOwner}
      deedTemplates={groupDetails.data!.deedTemplates}
      deedStatuses={groupDetails.data!.deedStatuses}
    />
  );
};

export default GroupDetailsPage;
