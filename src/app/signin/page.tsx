import { SigninForm } from "@/auth/components/SigninForm";
import { VerificationCodeForm } from "@/auth/components/VerificationCodeForm";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Main } from "@/components/layout/Main";

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
        {email ? <VerificationCodeForm email={email} /> : <SigninForm />}
      </Main>
    </PageWrapper>
  );
};

export default Page;
