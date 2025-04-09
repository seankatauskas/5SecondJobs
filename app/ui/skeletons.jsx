const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton({search = false}) {
  return (
    <div
      className={`${shimmer} relative overflow-hidden border-4 border-gray-200 shadow-sm mb-2 px-5 md:px-8 pb-6`}
    >
      <div className="flex-col">
        <div className="flex pb-2 text-base font-bold text-white">
            <div className="w-8 h-8 bg-gray-400 flex items-center justify-center"></div>
            <div className="w-8 h-8 bg-gray-400/80 flex items-center justify-center"></div>
            <div className="w-8 h-8 bg-gray-400/60 flex items-center justify-center"></div>
        </div>
        <div className="flex justify-between">
            <h2 className="text-[1.1rem] font-semibold w-64 bg-gray-200">&nbsp;</h2>
            <h2 className="text-base w-32 bg-gray-200 font-medium text-gray-500"></h2>
        </div>
        <div className="flex items-baseline">
            <h2 className="text-base italic bg-gray-200 w-24 h-4 my-1">&nbsp;</h2>
        </div>
        <div className="flex items-baseline">
            <h2 className="text-base italic bg-gray-200 w-40 h-4 my-1">&nbsp;</h2>
        </div>
        <div className="flex items-baseline">
            <h2 className="text-base italic bg-gray-200 w-32 h-4 my-1">&nbsp;</h2>
        </div>
        <div className="flex justify-between">
            <div className="flex text-base font-medium mt-1">
                <div className="bg-gray-200 rounded-lg p-1 pl-2 pr-2 mr-2 w-40">&nbsp;</div>
                <div className="bg-gray-200 rounded-lg p-1 pl-2 pr-2 mr-2 w-40">&nbsp;</div>
            </div>
            <div>
                {search ? <h2 className="text-base w-32 bg-gray-200 font-medium text-gray-500 mt-2 mb-1 h-6"></h2>
                : <h2 className="text-base w-24 bg-gray-200 font-medium text-gray-500 mt-2 mb-1 h-6"></h2>
                }
            </div>
        </div>
    </div>
    </div>
  );
}

export function FilterSkeleton() {
    return (
        <div
          className={`${shimmer} relative overflow-hidden mb-4`}
        >
            <div className="flex">
            <div className="w-2/5 border-2 bg-gray-100 border-gray-200 h-7">
            </div>
            <div className="ml-auto w-14 bg-gray-100 border-2 border-gray-200 h-7">
            </div>
            </div>
        </div>
    )
}

export function CardsSkeleton({search}) {
  return (
    <>
        {[...Array(20).keys()].map(key => <CardSkeleton key={key} search={search}/>)}
    </>
  );
}

