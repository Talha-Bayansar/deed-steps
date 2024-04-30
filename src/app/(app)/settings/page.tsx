import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { View } from "@/components/layout/View";
import { SignOutButton } from "./_components/SignOutButton";
import { ChangeName } from "./_components/ChangeName";

const Page = () => {
  return (
    <Main>
      <Title>Settings</Title>
      <View className="gap-0">
        <ChangeName />
        <SignOutButton />
      </View>
    </Main>
  );
};

export default Page;
