import { GroupAdmin } from "../group-admin/types";

export const isUserAdmin = (userId: number, groupAdmins: GroupAdmin[]) => {
  return groupAdmins.some((ga) => ga.userId === userId);
};
