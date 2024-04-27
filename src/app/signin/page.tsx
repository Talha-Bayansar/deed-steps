import { SigninForm } from "@/auth/components/SigninForm";
import { VerificationCodeForm } from "@/auth/components/VerificationCodeForm";

type Props = {
  searchParams: {
    email: string;
  };
};

const Page = ({ searchParams }: Props) => {
  const email = searchParams.email;
  return (
    <main className="flex-grow grid place-items-center">
      {email ? <VerificationCodeForm email={email} /> : <SigninForm />}
    </main>
  );
};

export default Page;
