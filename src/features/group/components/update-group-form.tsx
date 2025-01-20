"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateGroupById } from "../api";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AppForm } from "@/components/app-form";
import { LoadingButton } from "@/components/loading-button";
import { Input } from "@/components/ui/input";

type Props = {
  group: {
    id: number;
    name: string;
  };
  onSuccess?: (newValues: { name: string }) => void;
};

export const UpdateGroupForm = ({ group, onSuccess }: Props) => {
  const t = useTranslations();

  const formSchema = z.object({
    name: z
      .string()
      .min(3, t("validations.minLength", { field: t("title"), length: 3 }))
      .max(50, t("validations.maxLength", { field: t("title"), length: 50 })),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: group.name,
    },
  });

  const { executeAsync, isPending } = useAction(updateGroupById);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await executeAsync({
      groupId: group.id,
      name: values.name,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        onSuccess?.(values);
        toast.success(t("updateSuccess"));
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
          <LoadingButton
            isLoading={isPending}
            disabled={!form.formState.isDirty}
          >
            {t("update")}
          </LoadingButton>
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
