import { UpdateGroupTile } from "../_components/update-group-tile";
import { DeleteGroupTile } from "../_components/delete-group-tile";
import { InviteUserTile } from "../_components/invite-user-tile";
import { ManageDeedsTile } from "../_components/manage-deeds-tile";
import { TransactionTile } from "../_components/transaction-tile";
import { NotificationPreferencesTile } from "../_components/notification-preferences-tile";
import { View } from "@/components/layout/view";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ErrorState } from "@/components/error-state";
import { getMyUserToGroupByGroupId } from "@/features/user-to-group/api";
import { hasGroupPermission } from "@/features/user-to-group/access-control/permissions";
import { TransactionsTile } from "../_components/transactions-tile";
import { getGroupById } from "@/features/group/api";
import { getActiveGroupSessionByGroupId } from "@/features/group-session/api";
import { StartGroupSessionTile } from "../_components/start-group-session-tile";
import { EndGroupSessionTile } from "../_components/end-group-session-tile";
import { HistoryTile } from "../_components/history-tile";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const GroupSettingsPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");
  const t = await getTranslations();

  const userToGroup = await getMyUserToGroupByGroupId(Number(id));
  const group = await getGroupById(Number(id));
  const activeGroupSession = await getActiveGroupSessionByGroupId(Number(id));

  const error = extractError(userToGroup, t);
  const groupError = extractError(group, t);
  const activeGroupSessionError = extractError(activeGroupSession, t);

  if (error || groupError || activeGroupSessionError)
    return (
      <ErrorState error={(error || groupError || activeGroupSessionError)!} />
    );

  return (
    <View className="gap-2">
      {hasGroupPermission(userToGroup.data!, "group:update") && (
        <UpdateGroupTile />
      )}
      {hasGroupPermission(userToGroup.data!, "member:add") && (
        <InviteUserTile />
      )}
      {hasGroupPermission(userToGroup.data!, "deedTemplate:edit") && (
        <ManageDeedsTile groupName={name} groupId={Number(id)} />
      )}
      {hasGroupPermission(userToGroup.data!, "notification:edit") && (
        <NotificationPreferencesTile group={group.data!} />
      )}
      {hasGroupPermission(userToGroup.data!, "transaction:read") && (
        <TransactionsTile groupName={name} groupId={Number(id)} />
      )}
      {hasGroupPermission(userToGroup.data!, "transaction:create") && (
        <TransactionTile groupName={name} groupId={Number(id)} />
      )}
      {hasGroupPermission(userToGroup.data!, "groupSession:start") &&
        !activeGroupSession.data && (
          <StartGroupSessionTile groupId={Number(id)} />
        )}
      {hasGroupPermission(userToGroup.data!, "groupSession:end") &&
        activeGroupSession.data && (
          <EndGroupSessionTile groupSessionId={activeGroupSession.data.id} />
        )}
      {hasGroupPermission(userToGroup.data!, "historicalGroupPoints:read") && (
        <HistoryTile groupName={name} groupId={Number(id)} />
      )}
      {hasGroupPermission(userToGroup.data!, "group:delete") && (
        <DeleteGroupTile groupId={Number(id)} />
      )}
    </View>
  );
};

export default GroupSettingsPage;
