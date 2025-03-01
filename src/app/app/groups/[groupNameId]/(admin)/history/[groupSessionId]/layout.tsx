import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { RevalidateButton } from "@/components/revalidate-button";
import { historicalGroupPointsKey } from "@/features/historical-group-points/queries";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    groupNameId: string;
    groupSessionId: string;
  }>;
};

export default async function HistoricalGroupPointsLayout({
  children,
  params,
}: Props) {
  const t = await getTranslations();
  const { groupNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  return (
    <PageContainer>
      <Navbar
        hrefBackButton={routes.groups.nameId(name, id).history.root}
        trailing={<RevalidateButton tags={[historicalGroupPointsKey]} />}
      >
        {t("groupPoints")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
}
