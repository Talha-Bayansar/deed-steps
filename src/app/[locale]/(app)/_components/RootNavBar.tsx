"use client";

import { Users, Home, Settings } from "lucide-react";
import { useParams } from "next/navigation";
import { usePathname } from "@/navigation";
import { routes } from "@/lib/routes";
import { NavigationBar } from "@/components/layout/NavigationBar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/IconButton";
import { Link } from "@/navigation";
import { InvitationsBadge } from "@/groups/components/InvitationsBadge";

export const RootNavBar = () => {
  const pathName = usePathname();
  const params = useParams<{ locale: string }>();
  const locale = params.locale;
  const currentPath =
    pathName.split(`/${locale}`)[pathName.split(`/${locale}`).length - 1] ||
    "/";

  const links = [
    {
      Icon: Home,
      href: routes.root,
      tooltip: "Home",
    },
    {
      Icon: Users,
      href: routes.groups.root,
      tooltip: "Groups",
    },
    {
      Icon: Settings,
      href: routes.settings.root,
      tooltip: "Settings",
    },
  ];

  return (
    <NavigationBar>
      {links.map((link) => (
        <TooltipProvider key={link.tooltip}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                className={cn({
                  "rounded-full bg-primary/20": currentPath === link.href,
                })}
              >
                <IconButton className="relative">
                  <link.Icon />
                  {link.tooltip === "Groups" && <InvitationsBadge />}
                </IconButton>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </NavigationBar>
  );
};
