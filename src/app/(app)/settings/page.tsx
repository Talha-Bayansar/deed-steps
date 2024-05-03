import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { View } from "@/components/layout/View";
import { SignOutButton } from "./_components/SignOutButton";
import { ChangeName } from "./_components/ChangeName";
import { Header } from "@/components/layout/Heading";

const Page = () => {
  return (
    <Main>
      <Header>
        <Title>Settings</Title>
      </Header>
      <View className="gap-0">
        <ChangeName />
        <SignOutButton />
      </View>
    </Main>
  );
};

export default Page;
