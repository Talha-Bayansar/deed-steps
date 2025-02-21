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
import { createDeedTemplate } from "../api";
import { toast } from "sonner";
import { AppForm } from "@/components/app-form";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { RecurrenceForm } from "./recurrence-form";
import { format, startOfToday } from "date-fns";
import { Button } from "@heroui/button";

type Props = {
  groupId: number;
  groupName: string;
};

export const CreateDeedTemplateForm = ({ groupId, groupName }: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const dtStart = format(startOfToday(), "yyyyMMdd");

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
      name: "",
      recurrence: `DTSTART:${dtStart}T000000Z\nRRULE:FREQ=DAILY;INTERVAL=1;WKST=MO`,
    },
  });

  const { executeAsync, isPending } = useAction(createDeedTemplate);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await executeAsync({
      name: values.name,
      groupId,
      recurrence: values.recurrence,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("createSuccess"));
        router.push(
          routes.groups.nameId(groupName, groupId).deedTemplates.root
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
          <Button
            isLoading={isPending}
            isDisabled={!form.formState.isDirty}
            type="submit"
            color="primary"
          >
            {t("create")}
          </Button>
        }
        className="overflow-y-visible"
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
