import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { View } from "@/components/layout/view";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { SearchX } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <PageContainer>
      <Navbar>{t("error")}</Navbar>
      <Main>
        <View className="flex-grow justify-center items-center gap-8">
          <SearchX size={80} />
          <h2 className="header-2 text-center">
            {t("notFound", { subject: t("page") })}
          </h2>
          <Link className={buttonVariants()} href={routes.landingPage.root}>
            {t("goToLandingPage")}
          </Link>
        </View>
      </Main>
    </PageContainer>
  );
}
