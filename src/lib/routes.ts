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
    id: (groupId: string) => ({
      root: `/groups/${groupId}`,
      settings: { root: `/groups/${groupId}/settings` },
      transaction: { root: `/groups/${groupId}/transaction` },
      deedTemplates: {
        root: `/groups/${groupId}/deed-templates`,
        id: (deedTemplateId: string) => ({
          root: `/groups/${groupId}/deed-templates/${deedTemplateId}`,
          edit: {
            root: `/groups/${groupId}/deed-templates/${deedTemplateId}/edit`,
          },
        }),
      },
    }),
  },
  settings: {
    root: "/settings",
  },
};
