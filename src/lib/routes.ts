export const routes = {
  landingPage: { root: "/" },
  root: "/app",
  signIn: {
    root: "/sign-in",
  },
  groups: {
    root: "/app/groups",
    create: {
      root: "/app/groups/create",
    },
    invitations: {
      root: "/app/groups/invitations",
    },
    id: (groupId: string | number) => ({
      root: `/app/groups/${groupId}`,
      settings: { root: `/app/groups/${groupId}/settings` },
      transaction: { root: `/app/groups/${groupId}/transaction` },
      deedTemplates: {
        root: `/app/groups/${groupId}/deed-templates`,
        id: (deedTemplateId: string | number) => ({
          root: `/app/groups/${groupId}/deed-templates/${deedTemplateId}`,
          edit: {
            root: `/app/groups/${groupId}/deed-templates/${deedTemplateId}/edit`,
          },
        }),
      },
    }),
  },
  settings: {
    root: "/app/settings",
  },
};
