"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfToday,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormatter } from "next-intl";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { View } from "./layout/view";

type Props = {
  selectedDay: Date;
  onSelectDay?: (day: Date) => void;
};

export function ScrollableCalendar({ selectedDay, onSelectDay }: Props) {
  const formatter = useFormatter();
  const today = startOfToday();
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(today));
  const intervals = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(selectedMonth),
      end: endOfMonth(selectedMonth),
    });
  }, [selectedMonth]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Automatically detect user's local timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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

  const handlePrevMonth = () =>
    setSelectedMonth(startOfMonth(subMonths(selectedMonth, 1)));
  const handleNextMonth = () =>
    setSelectedMonth(startOfMonth(addMonths(selectedMonth, 1)));

  return (
    <View className="w-full gap-0">
      <div className="text-lg font-medium flex items-center capitalize">
        <button onClick={handlePrevMonth}>
          <ChevronLeft className="text-primary" />
        </button>
        <span className="flex-grow text-center">
          {formatter.dateTime(selectedMonth, {
            month: "long",
            year: "numeric",
            timeZone,
          })}
        </span>
        <button onClick={handleNextMonth}>
          <ChevronRight className="text-primary" />
        </button>
      </div>
      <ScrollArea ref={scrollContainerRef} className="w-full pb-2">
        <div className="flex">
          {intervals.map((day, i) => (
            <Button
              variant="ghost"
              key={`day_${i}`}
              onClick={() => onSelectDay?.(day)}
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
                {formatter.dateTime(day, {
                  weekday: "short",
                  timeZone, // Use the dynamically detected timezone
                })}
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
}
