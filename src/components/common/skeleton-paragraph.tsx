import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonParagraph({
  paragraphs = 5,
}: {
  paragraphs?: number;
}) {
  return (
    <div className="flex w-full flex-col space-y-6">
      {Array.from({ length: paragraphs }).map((_, index) => {
        const lines = parseInt((Math.random() * 6).toString()) + 2;
        const hasTitle = Math.random() > 0.5;
        return (
          <div key={index} className="space-y-2">
            {hasTitle && <Skeleton className="h-6 w-1/2" />}
            {Array.from({ length: lines }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
            <Skeleton
              className={`h-4 w-${parseInt((Math.random() * 3 + 1).toString())}/4`}
            />
          </div>
        );
      })}
    </div>
  );
}
