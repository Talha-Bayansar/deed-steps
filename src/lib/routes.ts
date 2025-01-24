export const routes = {
  landingPage: { root: "/" },
  app: "/app",
  signIn: {
    root: "/sign-in",
  },
  groups: {
    root: "/app/groups",
    create: {
      root: "/app/groups/create",
    },
    nameId: (groupName: string, groupId: number | string) => ({
      root: `/app/groups/${encodeURIComponent(`${groupName}_${groupId}`)}`,
      settings: {
        root: `/app/groups/${encodeURIComponent(
          `${groupName}_${groupId}`
        )}/settings`,
      },
      transaction: {
        root: `/app/groups/${encodeURIComponent(
          `${groupName}_${groupId}`
        )}/transaction`,
      },
      deedTemplates: {
        root: `/app/groups/${encodeURIComponent(
          `${groupName}_${groupId}`
        )}/deed-templates`,
        create: {
          root: `/app/groups/${encodeURIComponent(
            `${groupName}_${groupId}`
          )}/deed-templates/create`,
        },
        id: (deedTemplateId: string | number) => ({
          root: `/app/groups/${encodeURIComponent(
            `${groupName}_${groupId}`
          )}/deed-templates/${deedTemplateId}`,
          edit: {
            root: `/app/groups/${encodeURIComponent(
              `${groupName}_${groupId}`
            )}/deed-templates/${deedTemplateId}/edit`,
          },
        }),
      },
    }),
  },
  invitations: {
    root: "/app/invitations",
  },
  settings: {
    root: "/app/settings",
  },
};
