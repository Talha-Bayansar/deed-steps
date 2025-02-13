import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { APP_NAME } from "@/lib/constants";
import { getTranslations } from "next-intl/server";

export const FAQ = async () => {
  const t = await getTranslations();

  return (
    <section
      id="faq"
      className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          {t("faqTitle")}
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              {t("faqQuestion1", { appName: APP_NAME })}
            </AccordionTrigger>
            <AccordionContent>{t("faqAnswer1")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              {t("faqQuestion2", { appName: APP_NAME })}
            </AccordionTrigger>
            <AccordionContent>
              {t("faqAnswer2", { appName: APP_NAME })}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{t("faqQuestion3")}</AccordionTrigger>
            <AccordionContent>{t("faqAnswer3")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              {t("faqQuestion4", { appName: APP_NAME })}
            </AccordionTrigger>
            <AccordionContent>
              {t("faqAnswer4", { appName: APP_NAME })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};
