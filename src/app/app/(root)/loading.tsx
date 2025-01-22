import { View } from "@/components/layout/a-new-view";
import { ScrollableCalendar } from "@/components/scrollable-calendar";
import { ListSkeleton } from "@/components/skeletons/list-skeleton";

const AppRootLoading = () => {
  return (
    <View>
      <ScrollableCalendar selectedDay={new Date()} />
      <ListSkeleton />
    </View>
  );
};

export default AppRootLoading;
