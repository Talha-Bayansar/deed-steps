"use client";

import { generateStripeCheckout } from "@/features/stripe/api";
import { routes } from "@/lib/routes";
import { handleResponse } from "@/lib/utils";
import { Button } from "@heroui/react";
import { Tab, Tabs } from "@heroui/tabs";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

type Plan = {
  priceId: null | {
    month: string;
    year: string;
  };
  name: string;
  price: null | {
    month: number;
    year: number;
  };
  features: string[];
};

const Pricing = () => {
  const t = useTranslations();

  const plans: Plan[] = [
    {
      priceId: null,
      name: t("free"),
      price: null,
      features: [t("joinUnlimitedGroups"), t("trackGroupDeeds")],
    },
    {
      priceId: {
        month: "price_1QqyjYGL1AGFWIgJ5Le6xFn1",
        year: "price_1Qqyl4GL1AGFWIgJetL5FzXG",
      },
      name: t("basic"),
      price: {
        month: 4.99,
        year: 49.99,
      },
      features: [
        t("everythingInPlan", { plan: t("free") }),
        t("createGroupsDescription", { amount: 3 }),
        t("createDeedTemplatesDescription", { amount: 10 }),
        t("createDeedStatusesDescription", { amount: 3 }),
      ],
    },
    {
      priceId: {
        month: "price_1Qqyk7GL1AGFWIgJ2UQ6GLFI",
        year: "price_1QqykjGL1AGFWIgJR1sIG3My",
      },
      name: t("pro"),
      price: {
        month: 9.99,
        year: 99.99,
      },
      features: [
        t("everythingInPlan", { plan: t("basic") }),
        t("createGroupsDescription", { amount: 10 }),
        t("createDeedTemplatesDescription", { amount: 30 }),
        t("createDeedStatusesDescription", { amount: 10 }),
      ],
    },
  ];

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">
          {t("chooseYourPath")}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          {t("chooseYourPathDescription")}
        </p>
        <Tabs className="w-full [&>div]:w-full flex justify-center [&>div]:max-w-2xl">
          <Tab key="monthly" title={t("monthly")}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard key={`month_${plan.name}`} plan={plan} type="month" />
              ))}
            </div>
          </Tab>
          <Tab key="yearly" title={t("yearly")}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard key={`year_${plan.name}`} plan={plan} type="year" />
              ))}
            </div>
          </Tab>
        </Tabs>
      </div>
    </section>
  );
};

const PlanCard = ({ plan, type }: { plan: Plan; type: "month" | "year" }) => {
  const t = useTranslations();
  const router = useRouter();
  const { executeAsync, isExecuting } = useAction(generateStripeCheckout);

  return (
    <div
      key={plan.name}
      className="flex flex-col justify-between p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700"
    >
      <div className="flex flex-col">
        <h3 className="text-2xl font-bold text-center mb-4">{plan.name}</h3>
        {/* <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
      {plan.description}
    </p> */}
        <p className="text-4xl font-bold text-center mb-6">
          {`€${plan.price ? plan.price[type] : 0}`}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            /{t(type)}
          </span>
        </p>
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="w-5 h-5 text-purple-600 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        color="primary"
        isLoading={isExecuting}
        onPress={async () => {
          if (!plan.price) {
            router.push(routes.app);
          } else {
            const url = await executeAsync({ priceId: plan.priceId![type] });
            handleResponse({
              t,
              response: url?.data,
              onSuccess: () => {
                if (url?.data?.data) {
                  router.push(url.data.data);
                }
              },
            });
          }
        }}
      >
        {!plan.price ? t("getStarted") : t("subscribe")}
      </Button>
    </div>
  );
};

export default Pricing;
