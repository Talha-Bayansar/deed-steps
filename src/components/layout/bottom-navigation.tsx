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
    <div className="fixed bottom-8 left-8 right-8">
      <div className="flex justify-between w-full rounded-full border p-2 bg-black/90">
        <AnimatedBackground
          defaultValue={tabs.find((tab) => tab.href === pathName)?.label}
          className="rounded-full"
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
              className="inline-flex h-12 w-12 items-center justify-center text-muted-foreground transition-all active:scale-90 hover:scale-90"
            >
              <tab.Icon className="h-6 w-6" />
            </Link>
          ))}
        </AnimatedBackground>
      </div>
    </div>
  );
};
