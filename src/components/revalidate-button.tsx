import { revalidateTag } from "next/cache";
import { RefreshIconButton } from "./icon-buttons/refresh-icon-button";

type Props = {
  tags: string[];
};

export const RevalidateButton = ({ tags }: Props) => {
  const revalidate = async () => {
    "use server";
    for (const tag of tags) {
      revalidateTag(tag);
    }
  };

  return (
    <form action={revalidate}>
      <RefreshIconButton type="submit" />
    </form>
  );
};
