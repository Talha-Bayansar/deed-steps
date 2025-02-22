"use client";

import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";

const Hero = () => {
  const t = useTranslations();

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
          <Button as={Link} href={routes.app} size="lg" color="primary">
            {t("getStarted")}
          </Button>
          <Button as={Link} href={"#features"} size="lg" variant="bordered">
            {t("learnMore")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
