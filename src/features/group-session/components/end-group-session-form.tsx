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
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { AppForm } from "@/components/app-form";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { endGroupSession } from "../api";
import { toast } from "sonner";
import { Button } from "@heroui/button";

interface EndGroupSessionFormProps {
  groupSessionId: number;
  onSuccess?: () => void;
}

export const EndGroupSessionForm = ({
  groupSessionId,
  onSuccess,
}: EndGroupSessionFormProps) => {
  const t = useTranslations();

  const formSchema = z.object({
    name: z
      .string()
      .min(3, t("validations.minLength", { field: t("title"), length: 3 }))
      .max(50, t("validations.maxLength", { field: t("title"), length: 50 })),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { executeAsync, isPending } = useAction(endGroupSession);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await executeAsync({
      ...values,
      groupSessionId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
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
            type="submit"
            color="primary"
            isLoading={isPending}
            isDisabled={!form.formState.isDirty}
          >
            {t("submit")}
          </Button>
        }
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}*</FormLabel>
              <FormControl>
                <Input placeholder={t("name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("description")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </AppForm>
    </Form>
  );
};
