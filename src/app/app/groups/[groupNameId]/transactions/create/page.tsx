import { getTranslations } from "next-intl/server";
import { ErrorState } from "@/components/error-state";
import { CreateTransactionView } from "@/features/transaction/components/create-transaction-view";

type Props = {
  searchParams: Promise<{
    amount?: string;
  }>;
  params: Promise<{
    groupNameId: string;
  }>;
};

const CreateTransactionPage = async ({ searchParams, params }: Props) => {
  const { amount } = await searchParams;
  const { groupNameId } = await params;
  const t = await getTranslations();
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  if (!amount || Number(amount) < 1 || Number(amount) > 1000000)
    return <ErrorState error={t("invalidAmount")} />;

  return (
    <CreateTransactionView
      amount={Number(amount)}
      groupId={Number(id)}
      groupName={name}
    />
  );
};

export default CreateTransactionPage;
