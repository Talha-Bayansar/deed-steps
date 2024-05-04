import { Header } from "@/components/layout/Heading";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { MyDeedTemplatesView } from "@/deeds/components/MyDeedTemplatesView";

export default function Home() {
  return (
    <Main>
      <Header>
        <Title>My Deeds</Title>
      </Header>
      <MyDeedTemplatesView />
    </Main>
  );
}
