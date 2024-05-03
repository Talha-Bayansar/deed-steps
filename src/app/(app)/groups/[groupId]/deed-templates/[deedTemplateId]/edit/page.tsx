import { Main } from "@/components/layout/Main";
import { EditDeedTemplateView } from "../_components/EditDeedTemplateView";
import { Title } from "@/components/layout/Title";
import { CreateDeedStatus } from "../_components/CreateDeedStatus";
import { Header } from "@/components/layout/Heading";

const Page = () => {
  return (
    <Main>
      <Header>
        <Title>Edit deed template</Title>
        <CreateDeedStatus />
      </Header>
      <EditDeedTemplateView />
    </Main>
  );
};

export default Page;
