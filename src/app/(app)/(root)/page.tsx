import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { MyDeedTemplatesView } from "@/deeds/components/MyDeedTemplatesView";

export default function Home() {
  return (
    <Main>
      <Title>My Deeds</Title>
      <MyDeedTemplatesView />
    </Main>
  );
}
