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
import { LoadingButton } from "@/components/loading-button";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { RecurrenceForm } from "./recurrence-form";

type Props = {
  groupId: number;
  groupName: string;
};

export const CreateDeedTemplateForm = ({ groupId, groupName }: Props) => {
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
      name: "",
      recurrence:
        "DTSTART:20250125T000000Z\nRRULE:FREQ=DAILY;INTERVAL=1;WKST=MO",
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
          <LoadingButton
            isLoading={isPending}
            disabled={!form.formState.isDirty}
          >
            {t("create")}
          </LoadingButton>
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
        <RecurrenceForm
          value={form.getValues("recurrence")}
          onChange={(value) => form.setValue("recurrence", value)}
        />
      </AppForm>
    </Form>
  );
};
