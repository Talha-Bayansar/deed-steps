"use client";
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
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

type Props = {
  label?: string;
  modalTitle: string;
  modalDescription: string;
  deleteFn: () => any;
};

export const DeleteButton = ({
  deleteFn,
  label,
  modalTitle,
  modalDescription,
}: Props) => {
  const t = useTranslations("global");
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full" variant="destructive">
          {label ?? t("delete")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{modalTitle}</AlertDialogTitle>
          <AlertDialogDescription>{modalDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteFn}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
