"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import QRCode from "react-qr-code";
import { routes } from "@/lib/routes";
import { useParams } from "next/navigation";
import { Link } from "@/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { View } from "@/components/layout/ror";

export const GenerateTransactionLinkForm = () => {
  const t = useTranslations("global");
  const { groupId, locale } = useParams<{ groupId: string; locale: string }>();
  const [transactionLink, setTransactionLink] = useState<string>(
    `${window.location.origin}/${locale}${
      routes.groups.nameId(groupId).transaction.root
    }?amount=1`
  );

  const formSchema = z.object({
    points: z.preprocess(
      (value) => Number(value),
      z
        .number()
        .min(1, t("errors.min_value", { value: 1 }))
        .max(1000000, t("errors.max_value", { value: 1000000 }))
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      points: 1,
    },
  });

  const onSubmit = (values: { points: number }) => {
    setTransactionLink(
      `${window.location.origin}/${locale}${
        routes.groups.nameId(groupId).transaction.root
      }?amount=${values.points}`
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 flex-grow justify-between md:justify-start"
      >
        <View className="items-center">
          <QRCode value={transactionLink} />
          <Link className="text-primary underline" href={transactionLink}>
            {transactionLink}
          </Link>
        </View>
        <FormField
          control={form.control}
          name="points"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("points")}</FormLabel>
              <FormControl>
                <Input inputMode="numeric" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t("generate")}</Button>
      </form>
    </Form>
  );
};
