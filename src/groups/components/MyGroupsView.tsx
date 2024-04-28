import { getMyGroups } from "../service";
import { GroupCard } from "./GroupCard";

export const MyGroupsView = async () => {
  const myGroups = await getMyGroups();

  return (
    <div className="flex flex-col gap-4">
      {myGroups.map((item) => (
        <GroupCard
          key={item.group.id}
          group={item.group}
          userCount={item.userCount}
        />
      ))}
    </div>
  );
};
