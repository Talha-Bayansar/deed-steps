import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { View } from "@/components/layout/View";
import { SignOutButton } from "./_components/SignOutButton";
import { ChangeName } from "./_components/ChangeName";
import { Heading } from "@/components/layout/Heading";
import { getTranslations } from "next-intl/server";
import { ChangeLocale } from "./_components/ChangeLocale";

const Page = async () => {
  const t = await getTranslations("SettingsPage");

  return (
    <Main>
      <Heading>
        <Title>{t("title")}</Title>
      </Heading>
      <View className="gap-0">
        <ChangeName />
        <ChangeLocale />
        <SignOutButton />
      </View>
    </Main>
  );
};

export default Page;
