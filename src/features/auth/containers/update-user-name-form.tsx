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
import { User } from "../types";
import { AppForm } from "@/components/app-form";
import { useAction } from "next-safe-action/hooks";
import { updateUserName } from "../api";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@heroui/button";

type Props = {
  user: User;
  onSuccess?: () => void;
};

export const UpdateUserNameForm = ({ user, onSuccess }: Props) => {
  const t = useTranslations();
  const formSchema = z.object({
    firstName: z
      .string()
      .min(1, t("validations.minLength", { field: t("firstName"), length: 1 }))
      .max(
        50,
        t("validations.maxLength", { field: t("firstName"), length: 50 })
      ),
    lastName: z
      .string()
      .min(1, t("validations.minLength", { field: t("lastName"), length: 1 }))
      .max(
        50,
        t("validations.maxLength", { field: t("lastName"), length: 50 })
      ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    },
  });

  const { executeAsync, isPending } = useAction(updateUserName);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await executeAsync(values);
    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("updateSuccess"));
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
            isLoading={isPending}
            isDisabled={!form.formState.isDirty}
            color="primary"
          >
            {t("update")}
          </Button>
        }
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("firstName")}</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("lastName")}</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </AppForm>
    </Form>
  );
};
