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
import ColorPicker from "@uiw/react-color-circle";
import { useTranslations } from "next-intl";
import { deedStatusColors } from "../config";
import { AppForm } from "@/components/app-form";
import { LoadingButton } from "@/components/loading-button";
import { useAction } from "next-safe-action/hooks";
import { createDeedStatus } from "../api";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  deedTemplateId: number;
  onSuccess?: () => void;
};

export const CreateDeedStatusForm = ({ deedTemplateId, onSuccess }: Props) => {
  const t = useTranslations();

  const formSchema = z.object({
    name: z
      .string()
      .min(3, t("validations.minLength", { field: t("name"), length: 1 }))
      .max(50, t("validations.maxLength", { field: t("name"), length: 50 })),
    color: z
      .string()
      .min(7, t("validations.minLength", { field: t("color"), length: 7 }))
      .max(30, t("validations.maxLength", { field: t("color"), length: 30 })),
    reward: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(0, t("validations.minValue", { field: t("reward"), value: 0 }))
        .max(100, t("validations.maxValue", { field: t("reward"), value: 100 }))
    ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      reward: 0,
      color: deedStatusColors[0],
    },
  });

  const { executeAsync, isPending } = useAction(createDeedStatus);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await executeAsync({
      ...values,
      deedTemplateId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("createSuccess"));
        onSuccess?.();
      },
      onError(message) {
        toast.error(message);
      },
    });
  }

  return (
    <Form {...form}>
      <AppForm
        submitButton={
          <LoadingButton
            isLoading={isPending}
            disabled={!form.formState.isDirty}
          >
            {t("create")}
          </LoadingButton>
        }
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("name")} {...field} />
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
              <FormLabel>{t("reward")}</FormLabel>
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
              <FormLabel>{t("color")}</FormLabel>
              <FormControl>
                <ColorPicker
                  className="[&>*]:!h-8 [&>*]:!w-8"
                  colors={deedStatusColors}
                  color={field.value}
                  onChange={(color) => form.setValue("color", color.hex)}
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
