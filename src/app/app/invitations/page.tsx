import { ErrorState } from "@/components/error-state";
import { InvitationsView } from "@/features/invitation/components/invitations-view";
import { getMyInvitations } from "@/features/invitation/api";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

const InvitationsRootPage = async () => {
  const t = await getTranslations();

  const invitations = await getMyInvitations();
  const error = extractError(invitations, t);

  if (error) return <ErrorState error={error} />;

  return <InvitationsView invitations={invitations.data!} />;
};

export default InvitationsRootPage;
