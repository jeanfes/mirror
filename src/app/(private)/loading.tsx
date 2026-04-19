export default function PrivateLoading() {
    return (
        <div className="w-full h-full flex flex-col gap-6">
            {/* Generic Page Header Skeleton */}
            <div className="flex flex-col gap-2">
                <div className="h-8 w-48 loading-shimmer rounded-xl" />
                <div className="h-5 w-72 loading-shimmer rounded-lg" />
            </div>
            
            {/* Stats/Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-surface-card rounded-2xl border border-border-soft p-5 flex flex-col justify-between overflow-hidden">
                        <div className="h-5 w-24 loading-shimmer rounded-lg" />
                        <div className="h-10 w-16 loading-shimmer rounded-xl" />
                    </div>
                ))}
            </div>
            
            {/* Main Area Skeleton */}
            <div className="flex-1 min-h-100 bg-surface-card rounded-3xl border border-border-soft p-6 flex flex-col gap-4 overflow-hidden">
                <div className="flex justify-between items-center border-b border-border-soft pb-4">
                    <div className="h-6 w-32 loading-shimmer rounded-lg" />
                    <div className="h-10 w-24 loading-shimmer rounded-full" />
                </div>
                
                {/* List items skeleton */}
                <div className="flex flex-col gap-3 mt-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 w-full loading-shimmer rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
