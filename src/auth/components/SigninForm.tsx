"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendEmailVerificationCode } from "../service";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

export const SigninForm = () => {
  const t = useTranslations("global");
  const tSignInPage = useTranslations("SignInPage");

  const formSchema = z.object({
    email: z.string().email(t("errors.email")),
  });
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await sendEmailVerificationCode(values.email);
    const searchParams = new URLSearchParams();
    searchParams.append("email", values.email);
    router.push(`/signin?${searchParams}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-grow gap-8 justify-between md:justify-start"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@acme.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{tSignInPage("send_verification_code")}</Button>
      </form>
    </Form>
  );
};
