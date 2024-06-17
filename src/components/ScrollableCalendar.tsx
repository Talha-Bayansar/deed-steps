"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  isSameDay,
  isToday,
  startOfMonth,
  startOfToday,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, getDayOfWeek } from "@/lib/utils";
import { View } from "./layout/View";
import { useFormatter, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
};

export const ScrollableCalendar = ({ selectedDay, onSelectDay }: Props) => {
  const format = useFormatter();
  const days = useTranslations("global.days");
  const today = startOfToday();
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(today));
  const intervals = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(selectedMonth),
      end: endOfMonth(selectedMonth),
    });
  }, [selectedMonth]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getDay = (index: number) => {
    switch (index) {
      case 0:
        return days("0.short");
      case 1:
        return days("1.short");
      case 2:
        return days("2.short");
      case 3:
        return days("3.short");
      case 4:
        return days("4.short");
      case 5:
        return days("5.short");
      case 6:
        return days("6.short");
    }
  };

  const changeMonth = (direction: "previous" | "next") => {
    const month = startOfMonth(selectedMonth);
    if (direction === "previous") {
      month.setMonth(month.getMonth() - 1);
    } else {
      month.setMonth(month.getMonth() + 1);
    }
    setSelectedMonth(month);
    onSelectDay(month);
  };

  useEffect(() => {
    // Scroll to the selected day when it changes
    if (scrollContainerRef.current) {
      const selectedDayButton =
        scrollContainerRef.current.querySelector(".is-selected");
      if (selectedDayButton) {
        selectedDayButton.scrollIntoView({ block: "center" });
      } else {
        const firstDay = scrollContainerRef.current.querySelector(".first");
        if (firstDay) {
          firstDay.scrollIntoView({ block: "center" });
        }
      }
    }
  }, [selectedMonth]);

  return (
    <View className="w-full gap-0">
      <div className="text-xl font-medium flex items-center capitalize">
        <button onClick={() => changeMonth("previous")}>
          <ChevronLeft className="text-primary" />
        </button>
        {format.dateTime(selectedMonth, { month: "long" })}
        <button
          className="flex-grow flex justify-end items-center"
          onClick={() => changeMonth("next")}
        >
          <ChevronRight className="text-primary" />
        </button>
      </div>
      <ScrollArea ref={scrollContainerRef} className="w-full pb-2">
        <div className="flex">
          {intervals.map((day, i) => (
            <Button
              variant="ghost"
              key={`day_${i}`}
              onClick={() => onSelectDay(day)}
              className={cn(
                "flex h-auto w-12 flex-col items-center rounded p-2 hover:bg-primary/15",
                {
                  "is-selected bg-primary/15": isSameDay(selectedDay, day),
                  first: i === 0,
                }
              )}
            >
              <span
                className={cn("text-sm font-normal", {
                  "text-primary": isToday(day),
                })}
              >
                {getDay(getDayOfWeek(day))}
              </span>
              <span
                className={cn("text-lg font-normal", {
                  "font-medium text-primary": isToday(day),
                  "font-bold": isSameDay(selectedDay, day),
                })}
              >
                {day.getDate()}
              </span>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </View>
  );
};
