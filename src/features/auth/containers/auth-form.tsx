import { SendCodeForm } from "../components/send-code-form";
import { VerifyCodeForm } from "../components/verify-code-form";

type Props = {
  email?: string;
  prefill?: string;
};

export const AuthForm = ({ email, prefill }: Props) => {
  if (!email) return <SendCodeForm prefill={prefill} />;
  else return <VerifyCodeForm email={email} />;
};
