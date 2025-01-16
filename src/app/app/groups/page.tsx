// import { IconButton } from "@/components/IconButton";
// import { Heading } from "@/components/layout/Heading";
// import { Main } from "@/components/layout/Main";
// import { Title } from "@/components/layout/Title";
// import { InvitationsBadge } from "@/features/groups/components/InvitationsBadge";
// import { MyGroupsView } from "@/features/groups/components/MyGroupsView";
// import { routes } from "@/lib/routes";
// import { Inbox, Plus } from "lucide-react";
// import { Link } from "@/navigation";
// import { getTranslations } from "next-intl/server";

// const Page = async () => {
//   const t = await getTranslations("GroupsPage");

//   return (
//     <Main>
//       <Heading>
//         <Title>{t("title")}</Title>
//         <div className="flex items-center">
//           <IconButton className="relative">
//             <Link href={routes.groups.invitations.root}>
//               <Inbox className="text-primary" />
//             </Link>
//             <InvitationsBadge />
//           </IconButton>
//           <IconButton>
//             <Link href={routes.groups.create.root}>
//               <Plus className="text-primary" />
//             </Link>
//           </IconButton>
//         </div>
//       </Heading>

//       <MyGroupsView />
//     </Main>
//   );
// };

// export default Page;
