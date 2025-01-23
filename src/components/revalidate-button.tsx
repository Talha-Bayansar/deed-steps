import { RefreshCw } from "lucide-react";
import { revalidateTag } from "next/cache";

type Props = {
  tags: string[];
};

export const RevalidateButton = ({ tags }: Props) => {
  return (
    <form
      action={async () => {
        "use server";
        for (const tag of tags) {
          revalidateTag(tag);
        }
      }}
    >
      <button type="submit" className="text-primary flex items-center">
        <RefreshCw />
      </button>
    </form>
  );
};
