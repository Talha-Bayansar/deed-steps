export const routes = {
  root: "/",
  signin: {
    root: "/signin",
  },
  groups: {
    root: "/groups",
    create: {
      root: "/groups/create",
    },
    id: (id: string) => ({
      root: `/groups/${id}`,
      settings: { root: `/groups/${id}/settings` },
    }),
  },
};
