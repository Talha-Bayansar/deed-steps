"use client";

import { Title } from "@/components/layout/Title";
import { useParams } from "next/navigation";

export const EditDeedTemplateView = () => {
  const { deedTemplateId } = useParams<{ deedTemplateId: string }>();

  return (
    <>
      <Title>{deedTemplateId}</Title>
    </>
  );
};
