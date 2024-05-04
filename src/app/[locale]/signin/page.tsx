import { SigninForm } from "@/auth/components/SigninForm";
import { VerificationCodeForm } from "@/auth/components/VerificationCodeForm";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { Header } from "@/components/layout/Heading";
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
        <Header>
          <Title>{t("title")}</Title>
        </Header>
        {email ? <VerificationCodeForm email={email} /> : <SigninForm />}
      </Main>
    </PageWrapper>
  );
};

export default Page;
