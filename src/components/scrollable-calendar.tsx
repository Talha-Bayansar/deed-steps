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
import { useFormatter } from "next-intl";
import { cn, normalizeDate } from "@/lib/utils";
import { Button, Card, CardBody, CardHeader, Divider } from "@heroui/react";

type Props = {
  selectedDay: Date;
  onSelectDay?: (day: Date) => void;
};

export function ScrollableCalendar({ selectedDay, onSelectDay }: Props) {
  const formatter = useFormatter();
  const today = startOfToday();
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    normalizeDate(startOfMonth(today))
  );

  const intervals = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(selectedMonth),
      end: endOfMonth(selectedMonth),
    });
  }, [selectedMonth]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the selected day’s month is displayed
    setSelectedMonth(normalizeDate(startOfMonth(selectedDay)));
  }, [selectedDay]);

  useEffect(() => {
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
    setSelectedMonth(normalizeDate(startOfMonth(subMonths(selectedMonth, 1))));
  const handleNextMonth = () =>
    setSelectedMonth(normalizeDate(startOfMonth(addMonths(selectedMonth, 1))));

  return (
    <Card className="w-full gap-0">
      <CardHeader className="text-lg font-medium flex items-center capitalize">
        <Button isIconOnly variant="light" onPress={handlePrevMonth}>
          <ChevronLeft className="text-primary" />
        </Button>
        <span className="flex-grow text-center">
          {formatter.dateTime(selectedMonth, {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          })}
        </span>
        <Button isIconOnly variant="light" onPress={handleNextMonth}>
          <ChevronRight className="text-primary" />
        </Button>
      </CardHeader>
      <Divider />
      <CardBody>
        <div ref={scrollContainerRef} className="w-full overflow-x-scroll">
          <div className="flex">
            {intervals.map((day, i) => (
              <Button
                aria-selected={isSameDay(selectedDay, day)}
                variant="light"
                key={`day_${i}`}
                onPress={() => onSelectDay?.(day)}
                className={cn(
                  "min-w-min flex h-auto flex-col gap-2 items-center rounded-full p-2",
                  {
                    "is-selected bg-primary/20": isSameDay(selectedDay, day),
                    first: i === 0,
                  }
                )}
              >
                <span
                  className={cn("text-sm text-zinc-400 font-bold", {
                    "text-primary": isToday(day),
                  })}
                >
                  {formatter.dateTime(normalizeDate(day), {
                    weekday: "short",
                    timeZone: "UTC",
                  })}
                </span>
                <span
                  className={cn("font-normal", {
                    "font-medium text-primary": isToday(day),
                  })}
                >
                  {day.getDate()}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
