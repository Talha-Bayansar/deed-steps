import { getTranslations } from "next-intl/server";
import { TransactionView } from "./_components/transaction-view";
import { ErrorState } from "@/components/error-state";

type Props = {
  searchParams: Promise<{
    amount?: string;
  }>;
  params: Promise<{
    groupNameId: string;
  }>;
};

const TransactionPage = async ({ searchParams, params }: Props) => {
  const { amount } = await searchParams;
  const { groupNameId } = await params;
  const t = await getTranslations();
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  if (!amount || Number(amount) < 1 || Number(amount) > 1000000)
    return <ErrorState error={t("invalidAmount")} />;

  return (
    <TransactionView
      amount={Number(amount)}
      groupId={Number(id)}
      groupName={name}
    />
  );
};

export default TransactionPage;
