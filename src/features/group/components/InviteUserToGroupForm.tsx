"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

type Props = {
  onSubmit: (values: { email: string }) => any;
  isLoading?: boolean;
};

export const InviteUserToGroupForm = ({
  onSubmit,
  isLoading = false,
}: Props) => {
  const t = useTranslations("global");
  const tGroupSettingsPage = useTranslations("GroupSettingsPage");
  const formSchema = z.object({
    email: z
      .string()
      .email(t("errors.email"))
      .min(5, t("errors.min", { amount: 5 }))
      .max(50, t("errors.max", { amount: 50 })),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 flex-grow justify-between md:justify-start"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tGroupSettingsPage("email_user")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
};
