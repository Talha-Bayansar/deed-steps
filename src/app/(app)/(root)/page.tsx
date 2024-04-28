import { SignoutButton } from "@/auth/components/SignoutButton";
import { validateRequest } from "@/auth/service";
import { Main } from "@/components/layout/Main";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const { user } = await validateRequest();
  return (
    <Main className="flex-grow grid place-items-center">
      {user ? (
        <p>You are signed in as {JSON.stringify(user, undefined, 2)}.</p>
      ) : (
        <p>You are not signed in.</p>
      )}
      {user ? (
        <SignoutButton />
      ) : (
        <Button asChild>
          <Link href="/signin">Sign in</Link>
        </Button>
      )}
    </Main>
  );
}
