import { Card, CardContent, CardHeader } from "@/_shared/components/ui/card";
import { Skeleton } from "@/_shared/components/ui/skeleton";

export const LoadingState = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-9 w-28" />
    </div>
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);