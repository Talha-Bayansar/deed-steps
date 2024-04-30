import { SigninForm } from "@/auth/components/SigninForm";
import { VerificationCodeForm } from "@/auth/components/VerificationCodeForm";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";

type Props = {
  searchParams: {
    email: string;
  };
};

const Page = ({ searchParams }: Props) => {
  const email = searchParams.email;
  return (
    <PageWrapper>
      <Main>
        <Title>Sign in</Title>
        {email ? <VerificationCodeForm email={email} /> : <SigninForm />}
      </Main>
    </PageWrapper>
  );
};

export default Page;
