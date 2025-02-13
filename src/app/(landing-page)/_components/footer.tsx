import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { routes } from "@/lib/routes";
import { ChangeLocale } from "@/features/i18n/components/change-locale";
import { Languages } from "lucide-react";

const Footer = async () => {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex items-center flex-shrink-0">
              <Image
                src="/icon512_maskable.png"
                width={32}
                height={32}
                alt={t("logoAlt", { appName: APP_NAME })}
                className="rounded-lg mr-2"
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                {APP_NAME}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 w-full">
              <Languages className="text-primary" />
              <ChangeLocale locale={locale} />
            </div>
            <nav className="flex gap-4">
              <Link
                className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                href={routes.legal.termsOfService.root}
              >
                {t("termsOfService")}
              </Link>
              <Link
                className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                href={routes.legal.privacyPolicy.root}
              >
                {t("privacyPolicy")}
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          {t("copyrightText", { year: 2025, appName: APP_NAME })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
