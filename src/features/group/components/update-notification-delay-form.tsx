"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { handleResponse } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { updateGroupById } from "../api";
import { toast } from "sonner";
import { Button } from "@heroui/button";
import { Group } from "../types";
import { Save } from "lucide-react";

type Props = {
  group: Group;
};

export const UpdateNotificationDelayForm = ({ group }: Props) => {
  const t = useTranslations();

  const formSchema = z.object({
    notificationDelay: z
      .number()
      .min(
        0,
        t("validations.minValue", { field: t("notificationDelay"), value: 0 })
      )
      .max(
        1440,
        t("validations.maxValue", {
          field: t("notificationDelay"),
          value: 1440,
        })
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notificationDelay: group.notificationDelay / 60,
    },
  });

  const { executeAsync, isPending } = useAction(updateGroupById);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await executeAsync({
      groupId: group.id,
      notificationDelay: values.notificationDelay * 60,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("updateSuccess"));
      },
      onError(message) {
        toast.error(message);
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-2 justify-between w-full"
      >
        <FormField
          control={form.control}
          name="notificationDelay"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" color="primary" isIconOnly isLoading={isPending}>
          <Save />
        </Button>
      </form>
    </Form>
  );
};
