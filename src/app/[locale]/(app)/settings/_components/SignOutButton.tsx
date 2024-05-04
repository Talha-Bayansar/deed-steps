"use client";

import { signout } from "@/auth/service";
import { ListTile } from "@/components/ListTile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => await signout(),
    onSuccess: () => {
      router.push(routes.signin.root);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ListTile className="text-destructive" type="submit">
          Sign out
        </ListTile>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to sign out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be signed out of your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
