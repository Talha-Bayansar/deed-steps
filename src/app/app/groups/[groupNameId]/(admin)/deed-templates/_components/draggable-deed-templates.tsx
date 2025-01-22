"use client";

import { View } from "@/components/layout/view";
import { ListTile } from "@/components/list-tile";
import { changeOrderDeedTemplates } from "@/features/deed-template/api";
import { DeedTemplate } from "@/features/deed-template/types";
import { routes } from "@/lib/routes";
import { useDragControls, Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";

type Props = {
  deedTemplates: DeedTemplate[];
  groupName: string;
  groupId: number;
};

export const DraggableDeedTemplates = ({
  deedTemplates,
  groupName,
  groupId,
}: Props) => {
  const [values, setValues] = useState<DeedTemplate[]>(deedTemplates);

  const { execute } = useAction(changeOrderDeedTemplates);

  return (
    <View className="gap-0">
      <Reorder.Group
        axis="y"
        values={values}
        onReorder={(newOrder) => {
          execute({
            orderedTemplateIds: newOrder.map((item) => item.id),
          });
          setValues(newOrder);
        }}
      >
        {values.map((deedTemplate) => (
          <DraggableListTile
            key={deedTemplate.id}
            deedTemplate={deedTemplate}
            groupName={groupName}
            groupId={groupId}
          />
        ))}
      </Reorder.Group>
    </View>
  );
};

const DraggableListTile = ({
  deedTemplate,
  groupName,
  groupId,
}: {
  deedTemplate: DeedTemplate;
  groupName: string;
  groupId: number;
}) => {
  const controls = useDragControls();

  return (
    <div className="list-tile">
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
                .nameId(groupName, groupId)
                .deedTemplates.id(deedTemplate.id).edit.root
            }
          >
            <ListTile>{deedTemplate.name}</ListTile>
          </Link>
        </div>
      </Reorder.Item>
    </div>
  );
};
