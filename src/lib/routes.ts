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
  settings: {
    root: "/app/settings",
  },
};
