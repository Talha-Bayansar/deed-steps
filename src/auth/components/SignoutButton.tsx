import { Button } from "@/components/ui/button";
import { signout } from "../service";

export const SignoutButton = () => {
  return (
    <form action={signout}>
      <Button type="submit">Sign out</Button>
    </form>
  );
};
