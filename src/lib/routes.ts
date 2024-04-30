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
    invitations: {
      root: "/groups/invitations",
    },
    id: (id: string) => ({
      root: `/groups/${id}`,
      settings: { root: `/groups/${id}/settings` },
    }),
  },
};
