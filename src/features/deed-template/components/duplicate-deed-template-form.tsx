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
import { handleResponse } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { duplicateDeedTemplate } from "../api";
import { toast } from "sonner";
import { AppForm } from "@/components/app-form";
import { Button } from "@heroui/button";

type Props = {
  deedTemplateId: number;
  onSuccess?: () => void;
};

export const DuplicateDeedTemplateForm = ({
  deedTemplateId,
  onSuccess,
}: Props) => {
  const t = useTranslations();

  const formSchema = z.object({
    name: z
      .string()
      .min(3, t("validations.minLength", { field: t("name"), length: 3 }))
      .max(50, t("validations.maxLength", { field: t("name"), length: 50 })),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { executeAsync, isPending } = useAction(duplicateDeedTemplate);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await executeAsync({
      newName: values.name,
      deedTemplateId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("duplicateSuccess"));
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
        onSubmit={form.handleSubmit(onSubmit)}
        submitButton={
          <Button
            isLoading={isPending}
            isDisabled={!form.formState.isDirty}
            type="submit"
            color="primary"
          >
            {t("duplicate")}
          </Button>
        }
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
      </AppForm>
    </Form>
  );
};
