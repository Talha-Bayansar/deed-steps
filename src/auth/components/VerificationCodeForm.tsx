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

const formSchema = z.object({
  code: z.string().min(8).max(8),
});

type Props = {
  email: string;
};

export const VerificationCodeForm = ({ email }: Props) => {
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
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="XXXX XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit verification code</Button>
      </form>
    </Form>
  );
};
