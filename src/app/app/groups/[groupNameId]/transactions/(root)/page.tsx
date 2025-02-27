import { ErrorState } from "@/components/error-state";
import { getTransactionsByGroupId } from "@/features/transaction/api";
import { TransactionsView } from "@/features/transaction/components/transactions-view";
import { hasGroupPermission } from "@/features/user-to-group/access-control/permissions";
import { getMyUserToGroupByGroupId } from "@/features/user-to-group/api";
import { routes } from "@/lib/routes";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const TransactionsRootPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");
  const t = await getTranslations();

  const [userToGroup, transactions] = await Promise.all([
    getMyUserToGroupByGroupId(Number(id)),
    getTransactionsByGroupId(Number(id)),
  ]);

  const error = extractError(transactions, t);
  const userToGroupError = extractError(userToGroup, t);

  if (error || userToGroupError)
    return <ErrorState error={(error || userToGroupError)!} />;

  if (!hasGroupPermission(userToGroup.data!, "transaction:read"))
    redirect(routes.groups.nameId(name, id).root);

  return (
    <TransactionsView initialData={transactions.data!} groupId={Number(id)} />
  );
};

export default TransactionsRootPage;
