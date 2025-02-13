import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routes } from "@/lib/routes";
const Hero = async () => {
  const t = await getTranslations();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900 dark:to-gray-900">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none xl:text-8xl/none max-w-3xl mx-auto mb-4">
          {t("heroTitle")}{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            {APP_NAME}
          </span>
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mb-8">
          {t("heroDescription")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={routes.app}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            >
              {t("getStarted")}
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              {t("learnMore")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
