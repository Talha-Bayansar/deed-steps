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
import type { DeedTemplate } from "../models";
import { useTranslations } from "next-intl";

type Props = {
  deedTemplate?: DeedTemplate;
  onSubmit: (values: { name: string }) => any;
  isLoading?: boolean;
};

export const DeedTemplateForm = ({
  deedTemplate,
  onSubmit,
  isLoading = false,
}: Props) => {
  const t = useTranslations("global");
  const tDeedTemplatesPage = useTranslations("DeedTemplatesPage");

  const formSchema = z.object({
    name: z
      .string()
      .min(3, t("errors.min", { amount: 3 }))
      .max(50, t("errors.max", { amount: 50 })),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: deedTemplate?.name ?? "",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tDeedTemplatesPage("deed_template_name")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tDeedTemplatesPage("deed_template_name")}
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
