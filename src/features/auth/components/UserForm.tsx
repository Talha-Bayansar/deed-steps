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
import type { User } from "../models";
import { View } from "@/components/layout/View";
import { useTranslations } from "next-intl";

type Props = {
  user: User;
  onSubmit: (values: { firstName: string; lastName: string }) => any;
  isLoading?: boolean;
};

export const UserForm = ({ user, onSubmit, isLoading = false }: Props) => {
  const t = useTranslations("global");
  const formSchema = z.object({
    firstName: z
      .string()
      .min(3, t("errors.min", { amount: 3 }))
      .max(50, t("errors.max", { amount: 50 })),
    lastName: z
      .string()
      .min(3, t("errors.min", { amount: 3 }))
      .max(50, t("errors.max", { amount: 3 })),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 flex-grow justify-between md:justify-start"
      >
        <View>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("first_name")}</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("last_name")}</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </View>
        <Button type="submit" disabled={isLoading}>
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
};
