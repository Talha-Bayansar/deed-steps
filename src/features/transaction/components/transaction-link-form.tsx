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
import { View } from "@/components/layout/view";
import Link from "next/link";
import { AppForm } from "@/components/app-form";
import { QrCodeIcon } from "lucide-react";
import { Button } from "@heroui/react";

type Props = {
  groupName: string;
  groupId: number;
};

export const TransactionLinkForm = ({ groupName, groupId }: Props) => {
  const t = useTranslations();
  const [transactionLink, setTransactionLink] = useState<string | null>(null);

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
      `${
        routes.groups.nameId(groupName, groupId).transactions.create.root
      }?amount=${values.points}`
    );
  };

  return (
    <Form {...form}>
      <AppForm
        onSubmit={form.handleSubmit(onSubmit)}
        submitButton={
          <Button type="submit" color="primary">
            {t("generate")}
          </Button>
        }
      >
        <View className="items-center">
          {transactionLink ? (
            <Link href={transactionLink}>
              <QRCode value={transactionLink} />
            </Link>
          ) : (
            <div className="border grid place-items-center w-64 h-64">
              <QrCodeIcon className="text-zinc-300" size={80} />
            </div>
          )}
        </View>
        <FormField
          control={form.control}
          name="points"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("points")}</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setTransactionLink(null);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </AppForm>
    </Form>
  );
};
