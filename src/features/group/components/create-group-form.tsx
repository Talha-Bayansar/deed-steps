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
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { createGroup } from "../api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { Button } from "@heroui/button";

export const CreateGroupForm = () => {
  const t = useTranslations();
  const router = useRouter();

  const formSchema = z.object({
    name: z
      .string()
      .min(3, t("validations.minLength", { field: t("title"), length: 3 }))
      .max(50, t("validations.maxLength", { field: t("title"), length: 50 })),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { executeAsync, isPending } = useAction(createGroup);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await executeAsync(values);

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        router.push(routes.groups.root);
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
            {t("create")}
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
