"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { toast } from "sonner";
import { signOut } from "../api";
import { useTranslations } from "next-intl";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@heroui/react";

type Props = Omit<ModalProps, "children">;

export const SignOutModal = (props: Props) => {
  const t = useTranslations();
  const { executeAsync, isPending } = useAction(signOut);
  const router = useRouter();

  const handleClick = async () => {
    const response = await executeAsync();

    if (response?.data?.success) {
      router.push(routes.signIn.root);
    } else {
      toast.error(response?.data?.message);
    }
  };

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col">
              <span>{t("areYouSure")}</span>
              <span className="text-sm text-zinc-400 font-normal">
                {t("signOutWarning")}
              </span>
            </ModalHeader>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose}>
                {t("cancel")}
              </Button>
              <Button
                onPress={handleClick}
                color="danger"
                isLoading={isPending}
              >
                {t("continue")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
