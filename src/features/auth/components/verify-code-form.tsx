"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { toast } from "sonner";
import { signin } from "../api";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";

type Props = {
  email: string;
};

export const VerifyCodeForm = ({ email }: Props) => {
  const t = useTranslations();
  const formSchema = z.object({
    code: z
      .string({
        required_error: t("validations.required", {
          field: t("verificationCode"),
        }),
      })
      .min(
        8,
        t("validations.minLength", { field: t("verificationCode"), length: 8 })
      )
      .max(
        8,
        t("validations.maxLength", { field: t("verificationCode"), length: 8 })
      ),
  });

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const { executeAsync, isPending } = useAction(signin);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await executeAsync({
      ...values,
      email,
    });

    if (response?.data?.success) {
      router.push(routes.app);
    } else {
      toast.error(response?.data?.message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-4 flex flex-col w-full items-center"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("verificationCode")}</FormLabel>
              <FormControl>
                <InputOTP {...field} maxLength={8}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          color="primary"
          className="w-full"
          type="submit"
          isLoading={isPending}
        >
          {t("verifyCode")}
        </Button>
      </form>
    </Form>
  );
};
