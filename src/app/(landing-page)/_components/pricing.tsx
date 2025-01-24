import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 9,
    features: [
      "5 Projects",
      "10 Team Members",
      "Basic Analytics",
      "Email Support",
    ],
  },
  {
    name: "Pro",
    price: 29,
    features: [
      "Unlimited Projects",
      "Unlimited Team Members",
      "Advanced Analytics",
      "Priority Support",
      "Custom Integrations",
    ],
  },
  {
    name: "Enterprise",
    price: 99,
    features: [
      "Everything in Pro",
      "Dedicated Account Manager",
      "Custom Reporting",
      "API Access",
      "On-Premise Deployment",
    ],
  },
];

const Pricing = () => {
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
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            {
              "Whether you're a small team or a large enterprise, we have a plan that fits your needs."
            }
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${plan.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
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
              <a
                href="#"
                className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white hover:bg-indigo-700"
              >
                Get started
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
