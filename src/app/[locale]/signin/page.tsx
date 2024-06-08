import { SigninForm } from "@/features/auth/components/SigninForm";
import { VerificationCodeForm } from "@/features/auth/components/VerificationCodeForm";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { Heading } from "@/components/layout/Heading";
import { getTranslations } from "next-intl/server";

type Props = {
  searchParams: {
    email: string;
  };
};

const Page = async ({ searchParams }: Props) => {
  const t = await getTranslations("SignInPage");
  const email = searchParams.email;

  return (
    <PageWrapper hasNavigationBar={false}>
      <Main>
        <Heading>
          <Title>{t("title")}</Title>
        </Heading>
        {email ? <VerificationCodeForm email={email} /> : <SigninForm />}
      </Main>
    </PageWrapper>
  );
};

export default Page;
