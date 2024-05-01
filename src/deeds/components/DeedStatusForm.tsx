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
import type { DeedStatus } from "../models";
import { View } from "@/components/layout/View";
import ColorFul from "@uiw/react-color-colorful";

const formSchema = z.object({
  name: z.string().min(3).max(50),
  color: z.string().min(7).max(30),
  reward: z.preprocess((val) => Number(val), z.number().min(0).max(100)),
});

type Props = {
  status?: DeedStatus;
  onSubmit: (values: z.infer<typeof formSchema>) => any;
  isLoading?: boolean;
};

export const DeedStatusForm = ({
  status,
  onSubmit,
  isLoading = false,
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: status?.name ?? "",
      reward: status?.reward ?? 0,
      color: status?.color ?? "#FFFFFF",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 flex-grow justify-between md:justify-start"
      >
        <View>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status name</FormLabel>
                <FormControl>
                  <Input placeholder="Status name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reward</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <ColorFul
                    color={field.value}
                    onChange={(color) => form.setValue("color", color.hex)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </View>
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
