import { Main } from "@/components/layout/Main";
import { WifiOff } from "lucide-react";

const Page = () => {
  return (
    <Main className="grid h-screen place-content-center place-items-center gap-8 p-8">
      <WifiOff className="text-destructive" size={60} />
      <p className="text-center">It looks like you are offline.</p>
    </Main>
  );
};

export default Page;
