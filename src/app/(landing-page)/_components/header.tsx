"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { routes } from "@/lib/routes";
import { Button } from "@heroui/button";

const Header = () => {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800">
      <div className="px-4 py-6 lg:px-6 flex items-center">
        <div className="flex items-center justify-between w-full">
          <Link
            className="flex items-center justify-center"
            href={routes.landingPage.root}
          >
            <Image
              src="/icon512_maskable.png"
              width={32}
              height={32}
              alt={t("logoAlt", { appName: APP_NAME })}
              className="rounded-lg"
            />
            <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              {APP_NAME}
            </span>
          </Link>
          <nav className="hidden sm:ml-auto sm:flex sm:gap-6">
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              href="#features"
            >
              {t("features")}
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              href="#pricing"
            >
              {t("pricing")}
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              href="#install"
            >
              {t("install")}
            </Link>
            {/* <Link
              className="text-sm font-medium hover:text-purple-600 transition-colors"
              href="#faq"
            >
              {t("faq")}
            </Link> */}
          </nav>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button onPress={() => setIsMenuOpen(!isMenuOpen)} isIconOnly>
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <nav className="pt-2 pb-3 space-y-1">
            <Link
              href="#features"
              className="block pl-3 pr-4 py-2 text-base font-medium hover:text-primary transition-colors"
            >
              {t("features")}
            </Link>
            <Link
              href="#pricing"
              className="block pl-3 pr-4 py-2 text-base font-medium hover:text-primary transition-colors"
            >
              {t("pricing")}
            </Link>
            <Link
              href="#install"
              className="block pl-3 pr-4 py-2 text-base font-medium hover:text-primary transition-colors"
            >
              {t("install")}
            </Link>
            <Link
              href="#cta"
              className="block pl-3 pr-4 py-2 text-base font-medium hover:text-primary transition-colors"
            >
              {t("getStarted")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
