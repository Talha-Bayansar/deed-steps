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
import { signin } from "../service";
import { useRouter } from "@/navigation";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "../hooks/useSession";
import { useTranslations } from "next-intl";

type Props = {
  email: string;
};

export const VerificationCodeForm = ({ email }: Props) => {
  const t = useTranslations("global");
  const formSchema = z.object({
    code: z
      .string()
      .min(
        8,
        t("errors.min", {
          amount: 8,
        })
      )
      .max(
        8,
        t("errors.max", {
          amount: 8,
        })
      ),
  });

  const tSignInPage = useTranslations("SignInPage");
  const router = useRouter();
  const { refetch } = useSession();
  const mutation = useMutation({
    mutationFn: async (code: string) => await signin(email, code),
    onSuccess: async () => {
      await refetch();
      router.push("/");
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values.code);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-grow flex flex-col gap-8 justify-between md:justify-start"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSignInPage("verification_code")}</FormLabel>
              <FormControl>
                <Input placeholder="XXXX XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
};
