"use client";
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
import { deleteGroup } from "@/groups/service";
import { routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export const DeleteGroup = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => await deleteGroup(Number(groupId)),
    onSuccess: () => {
      setIsOpen(false);
      router.push(routes.groups.root);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <ListTile className="text-destructive">Delete group</ListTile>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All data linked to this group will be
            lost.
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
