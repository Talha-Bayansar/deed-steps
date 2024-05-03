import { SigninForm } from "@/auth/components/SigninForm";
import { VerificationCodeForm } from "@/auth/components/VerificationCodeForm";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { Header } from "@/components/layout/Heading";

type Props = {
  searchParams: {
    email: string;
  };
};

const Page = ({ searchParams }: Props) => {
  const email = searchParams.email;
  return (
    <PageWrapper hasNavigationBar={false}>
      <Main>
        <Header>
          <Title>Sign in</Title>
        </Header>
        {email ? <VerificationCodeForm email={email} /> : <SigninForm />}
      </Main>
    </PageWrapper>
  );
};

export default Page;
