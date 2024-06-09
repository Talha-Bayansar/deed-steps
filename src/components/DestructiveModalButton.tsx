"use client";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { AlertModal } from "./AlertModal";
import { ListTile } from "./ListTile";

type Props = {
  title: string;
  description?: string;
  onContinue: () => any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type ButtonProps = Props & {
  type?: "button";
  label?: string;
};

type ListTileProps = Props & {
  type: "listTile";
  withSeparator?: boolean;
  isClickable?: boolean;
  triggerChildren: React.ReactNode;
};

export const DestructiveModalButton = ({
  type = "button",
  title,
  description,
  onContinue,
  open,
  onOpenChange,
  ...rest
}: ButtonProps | ListTileProps) => {
  const t = useTranslations("global");
  let trigger: React.ReactNode;

  if (type === "button") {
    const props = rest as ButtonProps;
    trigger = (
      <Button className="w-full" variant="destructive">
        {props.label ?? t("delete")}
      </Button>
    );
  } else {
    const props = rest as ListTileProps;
    trigger = (
      <ListTile
        className="w-full text-destructive"
        withSeparator={props.withSeparator}
        isClickable={props.isClickable}
      >
        {props.triggerChildren}
      </ListTile>
    );
  }

  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={title}
      description={description}
      onContinue={onContinue}
    />
  );
};
