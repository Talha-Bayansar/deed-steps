import { RootBottomNavigation } from "./_components/root-bottom-navigation";
import { getUser } from "@/features/auth/api";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

type Props = {
  children: React.ReactNode;
};

const AppLayout = async ({ children }: Props) => {
  const user = await getUser();

  if (!user) redirect(routes.signIn.root);

  return (
    <div className="flex flex-grow mb-[86px]">
      {children}
      <RootBottomNavigation />
    </div>
  );
};

export default AppLayout;
