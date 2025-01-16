import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { View } from "../layout/view";

export const CardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-full" />
      </CardHeader>
      <CardContent>
        <View className="gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-32" />
        </View>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
};
