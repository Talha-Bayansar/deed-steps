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
import { AppForm } from "@/components/app-form";
import { LoadingButton } from "@/components/loading-button";
import { useAction } from "next-safe-action/hooks";
import { inviteUserToGroup } from "../api";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  groupId: number;
  onSuccess?: () => void;
};

export const InviteUserForm = ({ groupId, onSuccess }: Props) => {
  const t = useTranslations();

  const formSchema = z.object({
    email: z
      .string()
      .email(t("validations.email"))
      .min(5, t("validations.minLength", { field: t("email"), length: 5 }))
      .max(50, t("validations.maxLength", { field: t("email"), length: 50 })),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { executeAsync, isPending } = useAction(inviteUserToGroup);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await executeAsync({
      email: values.email,
      groupId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("inviteSuccess"));
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
          <LoadingButton
            isLoading={isPending}
            disabled={!form.formState.isDirty}
          >
            {t("invite")}
          </LoadingButton>
        }
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("email")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </AppForm>
    </Form>
  );
};
