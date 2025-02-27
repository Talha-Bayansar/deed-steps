"use client";

import { View } from "@/components/layout/view";
import { CustomResponse } from "@/lib/utils";
import { Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { Pagination } from "../types";

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
  const scrollTrigger = useRef(null);

  const loadMoreItems = async () => {
    if (hasMoreData) {
      const newItems = await fetchMore({ offset, limit: pageSize });

      if (!newItems.data?.length || newItems.data.length < pageSize) {
        setHasMoreData(false);
      }

      setItems((prevItems) => [...prevItems, ...newItems.data!]);
      setOffset((prevOffset) => prevOffset + pageSize);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.5 }
    );

    if (scrollTrigger.current) {
      observer.observe(scrollTrigger.current);
    }

    return () => {
      if (scrollTrigger.current) {
        observer.unobserve(scrollTrigger.current);
      }
    };
  }, [hasMoreData, offset]);

  return (
    <View {...props}>
      {items.map(renderItem)}
      {hasMoreData && (
        <div ref={scrollTrigger}>
          <Spinner />
        </div>
      )}
    </View>
  );
};
