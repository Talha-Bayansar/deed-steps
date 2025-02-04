export type GroupRole = "owner" | "admin" | "member";

export type GroupAction =
  | "memberPoints:read"
  | "member:add"
  | "member:edit"
  | "member:delete"
  | "group:update"
  | "group:delete"
  | "deedTemplate:add"
  | "deedTemplate:edit"
  | "deedTemplate:delete"
  | "notification:edit"
  | "transaction:create"
  | "settings:read";

export type GroupPermissions = {
  [key: string]: GroupAction[];
};
