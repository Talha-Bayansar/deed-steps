"use client";

import { ALL_WEEKDAYS, Frequency, Options, RRule } from "rrule";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { View } from "@/components/layout/view";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MultiSelect, { Option } from "@/components/multi-select";
import { useTranslations } from "next-intl";
import { normalizeDate } from "@/lib/utils";
import { X } from "lucide-react";

enum RecurrenceEventType {
  FREQUENCY,
  INTERVAL,
  START_DATE,
  END_DATE,
  WEEKDAYS,
  // MONTHS,
  // MONTH_DAYS,
  // YEAR_DAYS,
  // WEEK_NUMBERS,
}

type Props = {
  value: string; // RRule string passed from the parent
  onChange: (newRule: string) => void; // Callback to pass the updated rule string
};

export function RecurrenceForm({ value, onChange }: Props) {
  const t = useTranslations();
  const rule = RRule.fromString(value);

  const { freq, interval, dtstart, until, byweekday } = rule.options;

  const frequency = freq ?? RRule.DAILY;
  const startDate = dtstart?.toISOString().split("T")[0] ?? "";
  const endDate = until?.toISOString().split("T")[0] ?? "";
  const weekdays = byweekday ?? [];

  const handleChange = (type: RecurrenceEventType, value: string) => {
    let rFrequency = frequency;
    let rStartDate = startDate;
    let rEndDate = endDate;
    let rWeekdays = weekdays;
    let rInterval = interval;

    switch (type) {
      case RecurrenceEventType.FREQUENCY:
        rFrequency = Number(value);
        rWeekdays = [];
        break;
      case RecurrenceEventType.START_DATE:
        rStartDate = value;
        break;
      case RecurrenceEventType.END_DATE:
        rEndDate = value;
        break;
      case RecurrenceEventType.INTERVAL:
        rInterval = Number(value);
        break;
      case RecurrenceEventType.WEEKDAYS:
        rWeekdays = value.split(",").map((v) => Number(v));
        break;
    }

    const options: Options = {
      freq: rFrequency,
      interval: rInterval,
      dtstart: rStartDate ? normalizeDate(new Date(rStartDate)) : null,
      until: rEndDate ? normalizeDate(new Date(rEndDate)) : null,
      byweekday: rWeekdays,
      // bymonth: months,
      // bymonthday: monthDays,
      // byyearday: yearDays,
      // byweekno: weekNumbers,
      bymonth: null,
      bymonthday: null,
      byyearday: null,
      byweekno: null,
      wkst: RRule.MO,
      count: null,
      tzid: null,
      bysetpos: null,
      bynmonthday: null,
      bynweekday: null,
      byhour: null,
      byminute: null,
      bysecond: null,
      byeaster: null,
    };

    const rule = new RRule(options);
    const ruleString = rule.toString();

    onChange(ruleString);
  };

  const dayOptions: Option[] = [
    {
      value: "MO",
      label: t("dayOfWeek.monday"),
    },
    {
      value: "TU",
      label: t("dayOfWeek.tuesday"),
    },
    {
      value: "WE",
      label: t("dayOfWeek.wednesday"),
    },
    {
      value: "TH",
      label: t("dayOfWeek.thursday"),
    },
    {
      value: "FR",
      label: t("dayOfWeek.friday"),
    },
    {
      value: "SA",
      label: t("dayOfWeek.saturday"),
    },
    {
      value: "SU",
      label: t("dayOfWeek.sunday"),
    },
  ];

  //   const monthOptions: Option[] = [
  //     {
  //       value: "1",
  //       label: t("nameOfMonth.january"),
  //     },
  //     {
  //       value: "2",
  //       label: t("nameOfMonth.february"),
  //     },
  //     {
  //       value: "3",
  //       label: t("nameOfMonth.march"),
  //     },
  //     {
  //       value: "4",
  //       label: t("nameOfMonth.april"),
  //     },
  //     {
  //       value: "5",
  //       label: t("nameOfMonth.may"),
  //     },
  //     {
  //       value: "6",
  //       label: t("nameOfMonth.june"),
  //     },
  //     {
  //       value: "7",
  //       label: t("nameOfMonth.july"),
  //     },
  //     {
  //       value: "8",
  //       label: t("nameOfMonth.august"),
  //     },
  //     {
  //       value: "9",
  //       label: t("nameOfMonth.september"),
  //     },
  //     {
  //       value: "10",
  //       label: t("nameOfMonth.october"),
  //     },
  //     {
  //       value: "11",
  //       label: t("nameOfMonth.november"),
  //     },
  //     {
  //       value: "12",
  //       label: t("nameOfMonth.december"),
  //     },
  //   ];

  return (
    <View className="gap-8">
      <View className="gap-2">
        <Label htmlFor="startDate">{t("startDate")}</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) =>
            handleChange(RecurrenceEventType.START_DATE, e.target.value)
          }
        />
      </View>
      <View className="gap-2">
        <Label htmlFor="endDate">{t("endDate")}</Label>
        <div className="w-full flex items-center relative">
          <Input
            id="endDate"
            className="pr-8"
            type="date"
            value={endDate}
            onChange={(e) =>
              handleChange(RecurrenceEventType.END_DATE, e.target.value)
            }
          />
          <button
            className="absolute right-2"
            type="button"
            onClick={() => handleChange(RecurrenceEventType.END_DATE, "")}
          >
            <X />
          </button>
        </div>
      </View>
      <View className="gap-2">
        <Label htmlFor="frequency">{t("frequency")}</Label>
        <Select
          value={frequency.toString()}
          onValueChange={(value) =>
            handleChange(RecurrenceEventType.FREQUENCY, value)
          }
        >
          <SelectTrigger id="frequency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Frequency.DAILY.toString()}>
              {t("daily")}
            </SelectItem>
            <SelectItem value={Frequency.WEEKLY.toString()}>
              {t("weekly")}
            </SelectItem>
            {/* <SelectItem value={Frequency.MONTHLY.toString()}>
              {t("monthly")}
            </SelectItem>
            <SelectItem value={Frequency.YEARLY.toString()}>
              {t("yearly")}
            </SelectItem> */}
          </SelectContent>
        </Select>
      </View>
      <View className="gap-2">
        <Label htmlFor="interval">{t("interval")}</Label>
        <Input
          id="interval"
          type="number"
          value={interval}
          onChange={(e) =>
            handleChange(RecurrenceEventType.INTERVAL, e.target.value)
          }
          min={1}
        />
      </View>
      <View className="gap-2">
        <Label htmlFor="weekdays">{t("weekdays")}</Label>
        <MultiSelect
          disabled={frequency !== Frequency.WEEKLY}
          defaultOptions={dayOptions}
          value={weekdays.map((weekday) => {
            const option = dayOptions.find((_, i) => i === weekday)!;
            return {
              value: option.value,
              label: option.label,
            };
          })}
          onChange={(values) =>
            handleChange(
              RecurrenceEventType.WEEKDAYS,
              values
                .map((option) =>
                  ALL_WEEKDAYS.findIndex((item) => item === option.value)
                )
                .toString()
            )
          }
          placeholder={t("weekdays")}
          hidePlaceholderWhenSelected
        />
      </View>
      {/* <View className="gap-2">
        <Label htmlFor="months">{t("months")}</Label>
        <MultiSelect
          defaultOptions={monthOptions}
          value={months.map((month) => ({
            value: month.toString(),
            label: monthOptions.find((v) => v.value === month.toString())!
              .label,
          }))}
          onChange={(values) => setMonths(values.map((v) => Number(v.value)))}
        />
      </View> */}
      {/* <View className="gap-2">
        <Label htmlFor="monthDays">{t("monthDays")}</Label>
        <Input
          id="monthDays"
          type="text"
          placeholder="e.g., 1, 15, -1"
          value={monthDays.join(", ")}
          onChange={(e) =>
            setMonthDays(
              e.target.value.split(",").map((v) => parseInt(v.trim(), 10))
            )
          }
        />
      </View>
      <View className="gap-2">
        <Label htmlFor="yearDays">{t("yearDays")}</Label>
        <Input
          id="yearDays"
          type="text"
          placeholder="e.g., 1, 100, -1"
          value={yearDays.join(", ")}
          onChange={(e) =>
            setYearDays(
              e.target.value.split(",").map((v) => parseInt(v.trim(), 10))
            )
          }
        />
      </View>
      <View className="gap-2">
        <Label htmlFor="weekNumbers">{t("weekNumbers")}</Label>
        <Input
          id="weekNumbers"
          type="text"
          placeholder="e.g., 1, 20, 52"
          value={weekNumbers.join(", ")}
          onChange={(e) =>
            setWeekNumbers(
              e.target.value.split(",").map((v) => parseInt(v.trim(), 10))
            )
          }
        />
      </View> */}
    </View>
  );
}
