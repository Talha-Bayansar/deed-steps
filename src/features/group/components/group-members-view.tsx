// "use client";

// import { User } from "@/features/auth/types";
// import { Group, GroupPoints } from "../types";
// import { isArrayEmpty } from "@/lib/utils";
// import { useTranslations } from "next-intl";
// import { EmptyState } from "@/components/empty-state";
// import { View } from "@/components/layout/view";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { ListTile } from "@/components/list-tile";
// import { DeleteMemberButton } from "../../user-to-group/components/delete-member-button";
// import { Button } from "@/components/ui/button";
// import { PromoteToAdminAlertDialog } from "@/features/user-to-group/components/promote-to-admin-alert-dialog";
// import { DemoteFromAdminAlertDialog } from "@/features/user-to-group/components/demote-from-admin-alert-dialog";
// import { UserToGroup } from "@/features/user-to-group/types";
// import { hasGroupPermission } from "@/features/user-to-group/access-control/permissions";

// type Props = {
//   group: Group;
//   points: GroupPoints[];
//   groupUsers: { user_to_group: UserToGroup; user: User }[];
//   currentUserToGroup: UserToGroup;
// };

// export const GroupMembersView = ({
//   group,
//   points,
//   groupUsers,
//   currentUserToGroup,
// }: Props) => {
//   const t = useTranslations();

//   if (isArrayEmpty(groupUsers))
//     return (
//       <EmptyState
//         title={t("emptyWarning")}
//         description={t("emptyWarningAction")}
//       />
//     );

//   return (
//     <View className="gap-0">
//       {groupUsers.map(({ user, user_to_group }) => (
//         <Drawer key={user.id}>
//           <DrawerTrigger
//             disabled={
//               !hasGroupPermission(currentUserToGroup, "member:delete") ||
//               group.ownerId === user.id
//             }
//             className="list-tile"
//           >
//             <ListTile
//               hideChevron={
//                 !hasGroupPermission(currentUserToGroup, "member:delete") ||
//                 group.ownerId === user.id
//               }
//             >
//               <View className="items-start gap-0">
//                 <div>
//                   {user.firstName} {user.lastName}
//                 </div>
//                 {hasGroupPermission(
//                   currentUserToGroup,
//                   "memberPoints:read"
//                 ) && (
//                   <div className="text-xs text-muted-foreground">
//                     {t("points")}:{" "}
//                     {points.find((p) => p.userId === user.id)?.points}
//                   </div>
//                 )}
//               </View>
//             </ListTile>
//           </DrawerTrigger>
//           <DrawerContent>
//             <DrawerHeader>
//               <DrawerTitle>{`${user.firstName} ${user.lastName}`}</DrawerTitle>
//             </DrawerHeader>
//             <DrawerFooter>
//               {hasGroupPermission(currentUserToGroup, "member:edit") &&
//                 (user_to_group.role === "admin" ? (
//                   <DemoteFromAdminAlertDialog
//                     userId={user.id}
//                     groupId={group.id}
//                   >
//                     <Button variant={"outline"}>{t("demote")}</Button>
//                   </DemoteFromAdminAlertDialog>
//                 ) : (
//                   <PromoteToAdminAlertDialog
//                     userId={user.id}
//                     groupId={group.id}
//                   >
//                     <Button>{t("promote")}</Button>
//                   </PromoteToAdminAlertDialog>
//                 ))}
//               {hasGroupPermission(currentUserToGroup, "member:delete") && (
//                 <DeleteMemberButton groupId={group.id} userId={user.id}>
//                   <Button variant="destructive">{t("delete")}</Button>
//                 </DeleteMemberButton>
//               )}
//             </DrawerFooter>
//           </DrawerContent>
//         </Drawer>
//       ))}
//     </View>
//   );
// };
