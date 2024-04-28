import { AuthWrapper } from "@/auth/components/AuthWrapper";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { RootNavBar } from "./_components/RootNavBar";

type Props = {
  children: JSX.Element;
};

const AppLayout = ({ children }: Props) => {
  return (
    <AuthWrapper>
      <PageWrapper>
        {children}
        <RootNavBar />
      </PageWrapper>
    </AuthWrapper>
  );
};

export default AppLayout;
