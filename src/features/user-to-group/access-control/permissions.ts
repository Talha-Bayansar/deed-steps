import { UserToGroup } from "../types";
import { GroupAction, GroupPermissions } from "./types";

export const groupPermissions: GroupPermissions = {
  owner: [
    "member:add",
    "member:edit",
    "member:delete",
    "group:update",
    "group:delete",
    "deedTemplate:add",
    "deedTemplate:edit",
    "deedTemplate:delete",
    "notification:edit",
    "transaction:read",
    "transaction:create",
    "settings:read",
    "memberPoints:read",
    "groupSession:read",
    "groupSession:start",
    "groupSession:end",
    "historicalGroupPoints:read",
  ],
  admin: [
    "transaction:read",
    "transaction:create",
    "settings:read",
    "memberPoints:read",
    "groupSession:read",
    "historicalGroupPoints:read",
  ],
  member: [],
};

export const hasGroupPermission = (
  userToGroup: UserToGroup,
  action: GroupAction
) => {
  const { role } = userToGroup;

  return groupPermissions[role].includes(action);
};
