import { CreateDeedTemplateForm } from "@/features/deed-template/components/create-deed-template-form";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const CreateDeedTemplatePage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  return <CreateDeedTemplateForm groupId={Number(id)} groupName={name} />;
};

export default CreateDeedTemplatePage;
