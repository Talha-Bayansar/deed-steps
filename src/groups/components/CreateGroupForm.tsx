"use client";

import { useMutation } from "@tanstack/react-query";
import { createGroup } from "../service";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { GroupForm } from "./GroupForm";

type Props = {};

export const CreateGroupForm = (props: Props) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      router.push(routes.groups.root);
    },
  });
  return <GroupForm onSubmit={(values) => mutation.mutate(values)} />;
};
