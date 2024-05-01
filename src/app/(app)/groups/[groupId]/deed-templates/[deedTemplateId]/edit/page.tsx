import { Main } from "@/components/layout/Main";
import { EditDeedTemplateView } from "../_components/EditDeedTemplateView";
import { Title } from "@/components/layout/Title";

const Page = () => {
  return (
    <Main>
      <Title>Edit deed template</Title>
      <EditDeedTemplateView />
    </Main>
  );
};

export default Page;
