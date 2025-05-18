import React from "react";
import { CircleOff, Grid2x2X, Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

interface GridLayoutProps<T> {
  items: T[];
  renderGridItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  skeletonCount?: number;
  error?: string;
  emptyMessage?: string;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  loadMoreError?: string;
  onLoadMore?: () => void;
  components?: {
    NoData?: React.ReactNode;
    Error?: React.ReactNode;
    Loading?: React.ReactNode;
  };
}

export default function GridLayout<T>({
  renderGridItem,
  items,
  keyExtractor,
  isLoading = false,
  hasMore = false,
  isLoadingMore = false,
  skeletonCount = 4,
  error,
  emptyMessage = "No data available.",
  loadMoreError,
  components,
  onLoadMore,
}: GridLayoutProps<T>) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-red-500/5 border-red-500/50 rounded-xl p-4 flex items-center justify-center space-y-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center">
            <CircleOff className="size-6" />
          </div>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (items?.length === 0) {
    return (
      components?.NoData || (
        <div className="w-full h-full bg-muted border-muted-foreground/50 rounded-xl p-4 flex items-center justify-center space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center">
              <Grid2x2X className="size-6" />
            </div>
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        </div>
      )
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((item) => (
          <div key={keyExtractor(item)}>{renderGridItem(item)}</div>
        ))}
      </div>
      {hasMore && (
        <div className="w-full flex items-center justify-center my-10">
          {loadMoreError ? (
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-red-500">{loadMoreError}</p>
              <Button variant="secondary" onClick={onLoadMore}>
                Réessayer
              </Button>
            </div>
          ) : (
            <Button onClick={onLoadMore} disabled={isLoadingMore}>
              {isLoadingMore && (
                <Loader2 className="size-4 animate-spin mr-2" />
              )}
              Afficher plus
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
