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
import { updateDeedTemplateById } from "../api";
import { toast } from "sonner";
import { AppForm } from "@/components/app-form";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { DeedTemplate } from "../types";
import { RecurrenceForm } from "./recurrence-form";
import { Button } from "@heroui/button";

type Props = {
  deedTemplate: DeedTemplate;
  groupId: number;
  groupName: string;
};

export const UpdateDeedTemplateForm = ({
  deedTemplate,
  groupId,
  groupName,
}: Props) => {
  const t = useTranslations();
  const router = useRouter();

  const formSchema = z.object({
    name: z
      .string()
      .min(3, t("validations.minLength", { field: t("name"), length: 3 }))
      .max(50, t("validations.maxLength", { field: t("name"), length: 50 })),
    recurrence: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: deedTemplate.name,
      recurrence: deedTemplate.recurrencyRule,
    },
  });

  const { executeAsync, isPending } = useAction(updateDeedTemplateById);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await executeAsync({
      id: deedTemplate.id,
      name: values.name,
      recurrence: values.recurrence,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("updateSuccess"));
        router.push(
          routes.groups
            .nameId(groupName, groupId)
            .deedTemplates.nameId(values.name, deedTemplate.id).root
        );
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
          <Button isLoading={isPending} type="submit" color="primary">
            {t("update")}
          </Button>
        }
        className="overflow-y-scroll"
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
          name="recurrence"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RecurrenceForm
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
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
