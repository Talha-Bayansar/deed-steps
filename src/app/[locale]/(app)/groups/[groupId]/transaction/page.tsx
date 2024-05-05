import { Heading } from "@/components/layout/Heading";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { TransactionView } from "./_components/TransactionView";

type Props = {
  searchParams: {
    amount?: string;
  };
};

const Page = async ({ searchParams: { amount } }: Props) => {
  if (!amount || Number(amount) < 1 || Number(amount) > 50) notFound();

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
