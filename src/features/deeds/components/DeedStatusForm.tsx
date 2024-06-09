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
import type { DeedStatus } from "../models";
import { View } from "@/components/layout/View";
import ColorPicker from "@uiw/react-color-circle";
import { useTranslations } from "next-intl";

const colors = [
  "#F44335",
  "#E91D63",
  "#9C27B0",
  "#673AB7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
];

type Props = {
  status?: DeedStatus;
  onSubmit: (values: { name: string; color: string; reward: number }) => any;
  isLoading?: boolean;
};

export const DeedStatusForm = ({
  status,
  onSubmit,
  isLoading = false,
}: Props) => {
  const t = useTranslations("global");
  const tEditDeedTemplatePage = useTranslations("EditDeedTemplatePage");

  const formSchema = z.object({
    name: z
      .string()
      .min(3, t("errors.min", { amount: 1 }))
      .max(50, t("errors.max", { amount: 50 })),
    color: z
      .string()
      .min(7, t("errors.min", { amount: 7 }))
      .max(30, t("errors.max", { amount: 30 })),
    reward: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(0, t("errors.min_value", { value: 0 }))
        .max(100, t("errors.max_value", { value: 100 }))
    ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: status?.name ?? "",
      reward: status?.reward ?? 0,
      color: status?.color ?? colors[0],
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tEditDeedTemplatePage("status_name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tEditDeedTemplatePage("status_name")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tEditDeedTemplatePage("reward")}</FormLabel>
                <FormControl>
                  <Input inputMode="numeric" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tEditDeedTemplatePage("color")}</FormLabel>
                <FormControl>
                  <ColorPicker
                    className="[&>*]:!h-8 [&>*]:!w-8"
                    colors={colors}
                    color={field.value}
                    onChange={(color) => form.setValue("color", color.hex)}
                  />
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
