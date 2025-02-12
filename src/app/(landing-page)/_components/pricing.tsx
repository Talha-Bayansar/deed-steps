import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateStripeCheckout } from "@/features/stripe/api";
import { routes } from "@/lib/routes";
import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
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
    <div id="pricing" className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            {"Pricing"}
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            {"Choose the right plan for your team"}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 md:mx-auto">
            {
              "Whether you're a small team or a large enterprise, we have a plan that fits your needs."
            }
          </p>
        </div>
        <Tabs className="py-12" defaultValue="month">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="month">{t("month")}</TabsTrigger>
            <TabsTrigger value="year">{t("year")}</TabsTrigger>
          </TabsList>
          <TabsContent value="month">
            <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
              {plans.map((plan) => (
                <PlanCard key={`month_${plan.name}`} plan={plan} type="month" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="year">
            <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
              {plans.map((plan) => (
                <PlanCard key={`year_${plan.name}`} plan={plan} type="year" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
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
      className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col"
    >
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
        <p className="mt-4 flex items-baseline text-gray-900">
          <span className="text-5xl font-extrabold tracking-tight">
            {`€${plan.price ? plan.price[type] : 0}`}
          </span>
          <span className="ml-1 text-xl font-semibold">/{t(type)}</span>
        </p>
        <ul className="mt-6 space-y-6">
          {plan.features.map((feature) => (
            <li key={feature} className="flex">
              <Check
                className="flex-shrink-0 w-6 h-6 text-green-500"
                aria-hidden="true"
              />
              <span className="ml-3 text-gray-500">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      {plan.priceId ? (
        <form
          action={async () => {
            "use server";
            const url = await generateStripeCheckout(plan.priceId![type]);
            if (url) {
              redirect(url);
            }
          }}
        >
          <button
            type="submit"
            className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white hover:bg-indigo-700"
          >
            {t("getStarted")}
          </button>
        </form>
      ) : (
        <Link
          href={routes.app}
          className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white hover:bg-indigo-700"
        >
          {t("getStarted")}
        </Link>
      )}
    </div>
  );
};

export default Pricing;
