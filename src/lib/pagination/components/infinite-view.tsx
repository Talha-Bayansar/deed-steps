"use client";

import { View } from "@/components/layout/view";
import { CustomResponse } from "@/lib/utils";
import { Button } from "@heroui/react";
import { useState, useCallback } from "react";
import { Pagination } from "../types";
import { useTranslations } from "next-intl";

type Props<T> = {
  initialItems: T[];
  renderItem: (item: T) => React.ReactNode;
  fetchMore: (pagination: Pagination) => Promise<CustomResponse<T[]>>;
  pageSize?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export const InfiniteView = <T,>({
  initialItems,
  renderItem,
  fetchMore,
  pageSize = 20,
  ...props
}: Props<T>) => {
  const [offset, setOffset] = useState(pageSize);
  const [items, setItems] = useState<T[]>(initialItems);
  const [hasMoreData, setHasMoreData] = useState(
    initialItems.length >= pageSize
  );
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = useCallback(async () => {
    if (hasMoreData && !isLoading) {
      try {
        setIsLoading(true);
        const newItems = await fetchMore({ offset, limit: pageSize });

        if (!newItems.data?.length || newItems.data.length < pageSize) {
          setHasMoreData(false);
        }

        setItems((prevItems) => [...prevItems, ...newItems.data!]);
        setOffset((prevOffset) => prevOffset + pageSize);
      } finally {
        setIsLoading(false);
      }
    }
  }, [hasMoreData, fetchMore, offset, pageSize, isLoading]);

  return (
    <View {...props}>
      {items.map(renderItem)}

      <div className="flex justify-center items-center">
        <Button
          onPress={loadMoreItems}
          isDisabled={!hasMoreData}
          isLoading={isLoading}
        >
          {t("loadMore")}
        </Button>
      </div>
    </View>
  );
};
