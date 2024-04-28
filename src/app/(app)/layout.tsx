import { AuthWrapper } from "@/components/AuthWrapper";

type Props = {
  children: JSX.Element;
};

const AppLayout = ({ children }: Props) => {
  return <AuthWrapper>{children}</AuthWrapper>;
};

export default AppLayout;
