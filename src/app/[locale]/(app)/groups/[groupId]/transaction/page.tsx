import { Heading } from "@/components/layout/Heading";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("TransactionPage");
  return (
    <Main>
      <Heading>
        <Title>{t("title")}</Title>
      </Heading>
    </Main>
  );
};

export default Page;
