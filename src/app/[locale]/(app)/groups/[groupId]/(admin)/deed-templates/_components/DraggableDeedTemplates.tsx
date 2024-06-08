"use client";

import { ListTile } from "@/components/ListTile";
import { View } from "@/components/layout/View";
import { useDeedTemplatesByGroupId } from "@/features/deeds/hooks/useDeedTemplatesByGroupId";
import type { DeedTemplate } from "@/features/deeds/models";
import { changeOrderDeedTemplates } from "@/features/deeds/service";
import { routes } from "@/lib/routes";
import { Link } from "@/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDragControls, Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";
import { useParams } from "next/navigation";

export const DraggableDeedTemplates = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { data } = useDeedTemplatesByGroupId(groupId);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (ids: number[]) => await changeOrderDeedTemplates(ids),
  });

  const setData = (values: typeof data) => {
    queryClient.setQueryData(["deeds", groupId], () => {
      return values;
    });
  };

  return (
    <View className="gap-0">
      <Reorder.Group
        axis="y"
        values={data!}
        onReorder={(newOrder) => {
          mutation.mutate(newOrder.map((item) => item.id));
          setData(newOrder);
        }}
      >
        {data!.map((deedTemplate) => (
          <DraggableListTile
            key={deedTemplate.id}
            deedTemplate={deedTemplate}
          />
        ))}
      </Reorder.Group>
    </View>
  );
};

const DraggableListTile = ({
  deedTemplate,
}: {
  deedTemplate: DeedTemplate;
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={deedTemplate}
      dragListener={false}
      dragControls={controls}
    >
      <div className="flex items-center w-full">
        <GripVertical
          className="cursor-move touch-none"
          onPointerDown={(e) => controls.start(e)}
        />

        <Link
          className="w-full"
          href={
            routes.groups
              .id(deedTemplate.groupId.toString())
              .deedTemplates.id(deedTemplate.id.toString()).edit.root
          }
        >
          <ListTile>{deedTemplate.name}</ListTile>
        </Link>
      </div>
    </Reorder.Item>
  );
};
