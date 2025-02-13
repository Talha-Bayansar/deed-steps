import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateStripeCheckout } from "@/features/stripe/api";
import { routes } from "@/lib/routes";
import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

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

const Pricing = async () => {
  const t = await getTranslations();

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
        <Tabs defaultValue="month" className="w-full">
          <TabsList className="mb-12 grid w-full max-w-md grid-cols-2 mx-auto">
            <TabsTrigger value="month">{t("monthly")}</TabsTrigger>
            <TabsTrigger value="year">{t("yearly")}</TabsTrigger>
          </TabsList>
          <TabsContent value="month">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard key={`month_${plan.name}`} plan={plan} type="month" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="year">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard key={`year_${plan.name}`} plan={plan} type="year" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

const PlanCard = async ({
  plan,
  type,
}: {
  plan: Plan;
  type: "month" | "year";
}) => {
  const t = await getTranslations();

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

      <form
        action={async () => {
          "use server";

          if (!plan.price) {
            redirect(routes.app);
          }

          const url = await generateStripeCheckout(plan.priceId![type]);
          if (url) {
            redirect(url);
          }
        }}
      >
        <Button
          className={
            "mt-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-full sm:w-auto"
          }
        >
          {!plan.price ? t("getStarted") : t("subscribe")}
        </Button>
      </form>
    </div>
  );
};

export default Pricing;
