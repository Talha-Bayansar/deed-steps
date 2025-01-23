import { RefreshCw } from "lucide-react";
import { revalidateTag } from "next/cache";

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
      <button type="submit" className="text-primary flex items-center">
        <RefreshCw />
      </button>
    </form>
  );
};
