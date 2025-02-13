import { Users, CheckCircle, Star, Bell } from "lucide-react";
import { getTranslations } from "next-intl/server";

const Features = async () => {
  const t = await getTranslations();

  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          {t("featuresTitle")}
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold">{t("groupManagement")}</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t("groupManagementDescription")}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold">
              {t("customizableDeedTemplates")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t("customizableDeedTemplatesDescription")}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold">{t("pointSystem")}</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t("pointSystemDescription")}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold">{t("pushNotifications")}</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t("pushNotificationsDescription")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
