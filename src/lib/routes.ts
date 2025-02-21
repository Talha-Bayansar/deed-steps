export const routes = {
  landingPage: { root: "/" },
  app: "/app",
  mySubscription: { root: "/my-subscription" },
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
      deeds: {
        root: `/app/groups/${encodeURIComponent(
          `${groupName}_${groupId}`
        )}/deeds`,
      },
      settings: {
        root: `/app/groups/${encodeURIComponent(
          `${groupName}_${groupId}`
        )}/settings`,
      },
      transactions: {
        root: `/app/groups/${encodeURIComponent(
          `${groupName}_${groupId}`
        )}/transactions`,
        create: {
          root: `/app/groups/${encodeURIComponent(
            `${groupName}_${groupId}`
          )}/transactions/create`,
        },
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
        nameId: (
          deedTemplateName: string,
          deedTemplateId: string | number
        ) => ({
          root: `/app/groups/${encodeURIComponent(
            `${groupName}_${groupId}`
          )}/deed-templates/${encodeURIComponent(
            `${deedTemplateName}_${deedTemplateId}`
          )}`,
          update: {
            root: `/app/groups/${encodeURIComponent(
              `${groupName}_${groupId}`
            )}/deed-templates/${encodeURIComponent(
              `${deedTemplateName}_${deedTemplateId}`
            )}/update`,
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
  legal: {
    root: "/legal",
    privacyPolicy: {
      root: "/legal#privacy-policy",
    },
    termsOfService: {
      root: "/legal#terms-of-service",
    },
  },
};
