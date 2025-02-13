import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { getTranslations } from "next-intl/server";

const Footer = async () => {
  const t = await getTranslations();

  return (
    <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src="/placeholder.svg?height=32&width=32"
              width={32}
              height={32}
              alt={t("logoAlt", { appName: APP_NAME })}
              className="rounded-lg mr-2"
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              {APP_NAME}
            </span>
          </div>
          <nav className="flex gap-4">
            <Link
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
              href="#"
            >
              {t("termsOfService")}
            </Link>
            <Link
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
              href="#"
            >
              {t("privacyPolicy")}
            </Link>
          </nav>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          {t("copyrightText", { year: 2025, appName: APP_NAME })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
