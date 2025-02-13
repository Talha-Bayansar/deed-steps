import { APP_NAME } from "@/lib/constants";
import { Download } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const InstallSection = async () => {
  const t = await getTranslations();

  return (
    <section
      id="install"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          {t("installTitle", { appName: APP_NAME })}
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center mb-4">
              <Download className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold">{t("ios")}</h3>
            <ol className="text-gray-500 dark:text-gray-400 text-left">
              <li>1. {t("installIosStep1")}</li>
              <li>2. {t("installIosStep2")}</li>
              <li>3. {t("installIosStep3")}</li>
              <li>4. {t("installIosStep4")}</li>
            </ol>
          </div>
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mb-4">
              <Download className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold">{t("android")}</h3>
            <ol className="text-gray-500 dark:text-gray-400 text-left">
              <li>1. {t("installAndroidStep1")}</li>
              <li>2. {t("installAndroidStep2")}</li>
              <li>3. {t("installAndroidStep3")}</li>
              <li>4. {t("installAndroidStep4")}</li>
            </ol>
          </div>
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center mb-4">
              <Download className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold">{t("desktop")}</h3>
            <ol className="text-gray-500 dark:text-gray-400 text-left">
              <li>1. {t("installDesktopStep1")}</li>
              <li>2. {t("installDesktopStep2")}</li>
              <li>3. {t("installDesktopStep3")}</li>
              <li>4. {t("installDesktopStep4")}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
