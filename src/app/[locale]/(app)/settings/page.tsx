import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { View } from "@/components/layout/View";
import { SignOutButton } from "./_components/SignOutButton";
import { ChangeName } from "./_components/ChangeName";
import { Header } from "@/components/layout/Heading";
import { getTranslations } from "next-intl/server";
import { ChangeLocale } from "./_components/ChangeLocale";

const Page = async () => {
  const t = await getTranslations("SettingsPage");

  return (
    <Main>
      <Header>
        <Title>{t("title")}</Title>
      </Header>
      <View className="gap-0">
        <ChangeName />
        <ChangeLocale />
        <SignOutButton />
      </View>
    </Main>
  );
};

export default Page;
