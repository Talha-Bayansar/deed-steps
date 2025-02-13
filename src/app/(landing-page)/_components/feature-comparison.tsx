export const FeatureComparison = () => {
  const featureComparison = [
    {
      feature: "Join Groups",
      free: "Unlimited",
      basic: "Unlimited",
      pro: "Unlimited",
    },
    { feature: "Track Group Deeds", free: "✓", basic: "✓", pro: "✓" },
    { feature: "Create Groups", free: "✕", basic: "Up to 3", pro: "Up to 10" },
    {
      feature: "Deed Templates per Group",
      free: "✕",
      basic: "Up to 10",
      pro: "Up to 30",
    },
    {
      feature: "Deed Statuses per Template",
      free: "✕",
      basic: "Up to 3",
      pro: "Up to 10",
    },
    { feature: "QR Code Transactions", free: "✕", basic: "✓", pro: "✓" },
    {
      feature: "Push Notifications",
      free: "✕",
      basic: "Basic",
      pro: "Enhanced",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Feature Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-100 dark:bg-purple-900">
                <th className="p-3 text-left">Feature</th>
                <th className="p-3 text-center">Free</th>
                <th className="p-3 text-center">Basic</th>
                <th className="p-3 text-center">Pro</th>
              </tr>
            </thead>
            <tbody>
              {featureComparison.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-purple-200 dark:border-purple-700"
                >
                  <td className="p-3">{row.feature}</td>
                  <td className="p-3 text-center">{row.free}</td>
                  <td className="p-3 text-center">{row.basic}</td>
                  <td className="p-3 text-center">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
