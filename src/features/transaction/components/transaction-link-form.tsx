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
import QRCode from "react-qr-code";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { routes } from "@/lib/routes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { View } from "@/components/layout/view";
import Link from "next/link";
import { AppForm } from "@/components/app-form";

type Props = {
  groupName: string;
  groupId: number;
};

export const TransactionLinkForm = ({ groupName, groupId }: Props) => {
  const t = useTranslations();
  const [transactionLink, setTransactionLink] = useState<string>(
    `${routes.groups.nameId(groupName, groupId).transaction.root}?amount=1`
  );

  const formSchema = z.object({
    points: z.preprocess(
      (value) => Number(value),
      z
        .number()
        .min(1, t("validations.minValue", { field: t("points"), value: 1 }))
        .max(
          1000000,
          t("validations.maxValue", { field: t("points"), value: 1000000 })
        )
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
      `${routes.groups.nameId(groupName, groupId).transaction.root}?amount=${
        values.points
      }`
    );
  };

  return (
    <Form {...form}>
      <AppForm
        onSubmit={form.handleSubmit(onSubmit)}
        submitButton={<Button>{t("generate")}</Button>}
      >
        <View className="items-center">
          <QRCode value={transactionLink} />
          <Link
            className="text-primary underline text-wrap"
            href={transactionLink}
          >
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
      </AppForm>
    </Form>
  );
};
