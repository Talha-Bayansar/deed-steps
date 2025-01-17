"use server";

export async function getMyGroupInvitations() {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  const invitations = await db.query.invitationTable.findMany({
    where: eq(invitationTable.userId, user.id),
    with: {
      group: true,
    },
  });

  return invitations;
}

export async function inviteUserToGroup(email: string, groupId: number) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  const invitedUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, email.toLowerCase()),
    with: {
      sessions: true,
    },
  });

  if (!invitedUser) throw new DrizzleError({ message: "User not found" });

  const group = await db.query.groupTable.findFirst({
    where: eq(groupTable.id, groupId),
  });

  if (!group) throw new DrizzleError({ message: "Group not found" });

  const isUserAlreadyInGroup = await db.query.userToGroupTable.findFirst({
    where: and(
      eq(userToGroupTable.userId, invitedUser.id),
      eq(userToGroupTable.groupId, groupId)
    ),
  });

  if (isUserAlreadyInGroup)
    throw new DrizzleError({ message: "User already in group" });

  const isUserAlreadyInvited = await db.query.invitationTable.findFirst({
    where: and(
      eq(invitationTable.userId, invitedUser.id),
      eq(invitationTable.groupId, groupId)
    ),
  });

  if (isUserAlreadyInvited)
    throw new DrizzleError({ message: "User already invited" });

  await db.insert(invitationTable).values({
    userId: invitedUser.id,
    groupId,
  });

  const sessionIds = invitedUser.sessions.map((s) => s.id);
  const subscriptions = await db.query.pushSubscriptionTable.findMany({
    where: inArray(pushSubscriptionTable.sessionId, sessionIds),
  });
  const t = await getTranslations("global.messages");

  await sendNotificationToSubscribers(
    {
      title: t("group_invited_title"),
      body: t("group_invited_body", { groupName: group.name }),
      userId: invitedUser.id,
    },
    subscriptions
  );

  return true;
}

export async function acceptInvitation(invitationId: number) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });
  const invitation = await db.query.invitationTable.findFirst({
    where: and(
      eq(invitationTable.id, invitationId),
      eq(invitationTable.userId, user.id)
    ),
  });

  if (!invitation) throw new DrizzleError({ message: "Invitation not found" });

  await db.insert(userToGroupTable).values({
    userId: invitation.userId,
    groupId: invitation.groupId,
  });

  await db.insert(groupPointsTable).values({
    groupId: invitation.groupId,
    userId: invitation.userId,
    points: 0,
  });

  await db
    .delete(invitationTable)
    .where(
      and(
        eq(invitationTable.groupId, invitation.groupId),
        eq(invitationTable.userId, user.id)
      )
    );

  return true;
}

export async function declineInvitation(invitationId: number) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  const invitation = await db.query.invitationTable.findFirst({
    where: and(
      eq(invitationTable.id, invitationId),
      eq(invitationTable.userId, user.id)
    ),
  });

  if (!invitation) throw new DrizzleError({ message: "Invitation not found" });

  await db
    .delete(invitationTable)
    .where(
      and(
        eq(invitationTable.groupId, invitation.groupId),
        eq(invitationTable.userId, user.id)
      )
    );

  return true;
}
