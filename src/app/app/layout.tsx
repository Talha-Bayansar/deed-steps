import { RootBottomNavigation } from "./_components/root-bottom-navigation";
import { getUser } from "@/features/auth/api";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { NotificationPermissionWrapper } from "@/features/notification/components/notification-permission-wrapper";

type Props = {
  children: React.ReactNode;
};

const AppLayout = async ({ children }: Props) => {
  const user = await getUser();

  if (!user) redirect(routes.signIn.root);

  return (
    <NotificationPermissionWrapper>
      <div className="flex flex-col flex-grow mb-20">
        {children}
        <RootBottomNavigation />
      </div>
    </NotificationPermissionWrapper>
  );
};

export default AppLayout;
