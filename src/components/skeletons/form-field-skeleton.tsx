import { View } from "../layout/view";
import { Skeleton } from "../ui/skeleton";

export const FormFieldSkeleton = () => {
  return (
    <View className="gap-2">
      <Skeleton className="w-16 h-4" />
      <Skeleton className="w-full h-10" />
    </View>
  );
};
