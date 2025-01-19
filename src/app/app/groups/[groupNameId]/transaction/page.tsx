import { Heading } from "@/components/layout/Heading";
import { Main } from "@/components/layout/main";
import { Title } from "@/components/layout/Title";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { TransactionView } from "./_components/TransactionView";

type Props = {
  searchParams: Promise<{
    amount?: string;
  }>;
};

const Page = async (props: Props) => {
  const searchParams = await props.searchParams;

  const { amount } = searchParams;

  if (!amount || Number(amount) < 1 || Number(amount) > 1000000) notFound();

  const t = await getTranslations("TransactionPage");

  return (
    <Main>
      <Heading>
        <Title>{t("title")}</Title>
      </Heading>
      <TransactionView />
    </Main>
  );
};

export default Page;
