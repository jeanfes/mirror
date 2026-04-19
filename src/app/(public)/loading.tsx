export default function PublicLoading() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-pulse">
            <div className="flex flex-col items-center justify-center text-center space-y-8">
                {/* Badge skeleton */}
                <div className="h-8 w-40 bg-surface-hover rounded-full" />
                
                {/* Heading skeleton */}
                <div className="space-y-4 w-full max-w-3xl flex flex-col items-center">
                    <div className="h-14 md:h-20 w-3/4 bg-surface-hover rounded-2xl" />
                    <div className="h-14 md:h-20 w-2/4 bg-surface-hover rounded-2xl" />
                </div>
                
                {/* Paragraph skeleton */}
                <div className="space-y-3 w-full max-w-2xl flex flex-col items-center mt-6">
                    <div className="h-5 w-full bg-surface-hover rounded-lg" />
                    <div className="h-5 w-5/6 bg-surface-hover rounded-lg" />
                    <div className="h-5 w-4/6 bg-surface-hover rounded-lg" />
                </div>
                
                {/* Buttons skeleton */}
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                    <div className="h-14 w-48 bg-surface-hover rounded-full" />
                    <div className="h-14 w-40 bg-surface-hover rounded-full" />
                </div>
            </div>
            
            {/* Image/Dashboard preview skeleton */}
            <div className="mt-20 flex justify-center w-full">
                <div className="w-full max-w-5xl h-100 sm:h-150 bg-surface-hover rounded-2xl md:rounded-[40px] shadow-sm border border-border-soft" />
            </div>
        </div>
    );
}
