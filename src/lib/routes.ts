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
    id: (id: string) => `/groups/${id}`,
  },
};
