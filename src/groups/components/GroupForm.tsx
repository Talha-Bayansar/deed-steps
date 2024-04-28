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
import { useRouter } from "next/navigation";
import { createGroup } from "../service";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(3).max(50),
});

type Props = {};

export const GroupForm = (props: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const mutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      router.push(routes.myGroups.root);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 flex-grow justify-between md:justify-start"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Group name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          Create
        </Button>
      </form>
    </Form>
  );
};
