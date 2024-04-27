import { SignoutButton } from "@/auth/components/SignoutButton";
import { validateRequest } from "@/auth/service";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const { user } = await validateRequest();
  return (
    <main className="flex-grow grid place-items-center">
      {user ? (
        <SignoutButton />
      ) : (
        <Button asChild>
          <Link href="/signin">Sign in</Link>
        </Button>
      )}
    </main>
  );
}
