import { Main } from "@/components/layout/Main";
import { EditDeedTemplateView } from "../_components/EditDeedTemplateView";
import { Title } from "@/components/layout/Title";
import { CreateDeedStatus } from "../_components/CreateDeedStatus";

const Page = () => {
  return (
    <Main>
      <div className="flex justify-between items-start">
        <Title>Edit deed template</Title>
        <CreateDeedStatus />
      </div>
      <EditDeedTemplateView />
    </Main>
  );
};

export default Page;
