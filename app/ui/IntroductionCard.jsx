import { ArchiveBoxIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/solid'

export function IntroductionCard({ className}) {
     
    return (
    <div className={`px-5 md:px-8 pb-12 ${className}`}>
      <div className="flex-col">
            <IntroductionBaseCardComponent />
            <div className="mt-8 sm:mt-12 w-full max-w-4xl mx-auto overflow-hidden border-2 border-gray-300">
              <video 
                src="/5SecondJobs_Demo.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-auto"
              >
              </video>
            </div>
      </div>
    </div>
    );
}


function IntroductionBaseCardComponent() {
    return (
        <div className="pt-6 sm:pt-8">
            <h1 className="text-5xl font-semibold text-center">Filter Out the Noise,</h1>
            <h1 className="text-5xl font-semibold mb-6 text-center">Discover Roles That Fit You</h1>
            <h2 className="text-xl text-center">A job tracker that enables you to decide whether to pursue a role in 5 seconds.</h2>
        </div>
    )
}
