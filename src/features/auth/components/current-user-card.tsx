import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/db/schema";
import { useTranslations } from "next-intl";

type Props = {
  user: User;
};

export const CurrentUserCard = ({ user }: Props) => {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile")}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
    </Card>
  );
};
