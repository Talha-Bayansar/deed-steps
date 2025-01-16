"use client";

import { LucideIcon } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type BottomNavigationTab = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

type Props = {
  tabs: BottomNavigationTab[];
};

export const BottomNavigation = ({ tabs }: Props) => {
  const pathName = usePathname();

  return (
    <div className="fixed bottom-8 left-1/2 translate-x-[-50%]">
      <div className="flex w-full space-x-2 rounded-xl border border-zinc-950/10 bg-white p-2">
        <AnimatedBackground
          defaultValue={tabs.find((tab) => tab.href === pathName)?.label}
          className="rounded-lg bg-zinc-100"
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.3,
          }}
        >
          {tabs.map((tab) => (
            <Link
              href={tab.href}
              key={tab.label}
              data-id={tab.label}
              className="inline-flex h-9 w-9 items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950"
            >
              <tab.Icon className="h-5 w-5" />
            </Link>
          ))}
        </AnimatedBackground>
      </div>
    </div>
  );
};
