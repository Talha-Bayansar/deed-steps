import { PackageOpen } from "lucide-react";

type Props = {
  title: React.ReactNode;
  description: React.ReactNode;
  action?: React.ReactNode;
};

export const EmptyState = ({ title, description, action }: Props) => {
  return (
    <div className="text-center w-full flex-grow flex flex-col justify-center">
      <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
