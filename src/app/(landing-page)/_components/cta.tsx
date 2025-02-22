"use client";

import { APP_NAME } from "@/lib/constants";
import { routes } from "@/lib/routes";
import { Button } from "@heroui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const CTA = () => {
  const t = useTranslations();

  return (
    <section
      id="cta"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto max-w-[700px] text-purple-100 md:text-xl">
              {t("ctaDescription", { appName: APP_NAME })}
            </p>
          </div>

          <Button as={Link} href={routes.app} size="lg">
            {t("getStarted")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
