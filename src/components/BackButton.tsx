import { Link } from "@/navigation";
import { ArrowLeft } from "lucide-react";

type Props = {
  href: string;
};

export const BackButton = ({ href }: Props) => {
  return (
    <Link href={href} className="mr-2">
      <ArrowLeft className="text-primary" />
    </Link>
  );
};
