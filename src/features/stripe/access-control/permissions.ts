export type PricePlanLimits = {
  maxOwnedGroups: number;
  maxDeedTemplatesPerGroup: number;
  maxDeedStatusesPerDeedTemplate: number;
  //   maxJoinedGroups: number;
  //   maxMembersPerGroup: number;
  //   maxTransactionsPerMonth: number;
};

export const pricePlanLimits: Record<string, PricePlanLimits> = {
  free: {
    maxOwnedGroups: 0,
    maxDeedTemplatesPerGroup: 0,
    maxDeedStatusesPerDeedTemplate: 0,
  },
  basic: {
    maxOwnedGroups: 3,
    maxDeedTemplatesPerGroup: 10,
    maxDeedStatusesPerDeedTemplate: 3,
  },
  pro: {
    maxOwnedGroups: 10,
    maxDeedTemplatesPerGroup: 30,
    maxDeedStatusesPerDeedTemplate: 10,
  },
};
