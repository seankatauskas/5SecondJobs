import { lusitana } from '@/app/ui/fonts';
import { useState } from 'react';
import { ArrowTopRightOnSquareIcon, ArchiveBoxIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/solid'

export function IntroductionCard({ className}) {
     
    return (
    <div className={`px-5 md:px-8 pb-12 ${className}`}>
      <div className="flex-col">
            <IntroductionBaseCardComponent />
            <IntroductionTopExpandableCardComponent />
      </div>
    </div>
    );
}


function IntroductionBaseCardComponent() {
    return (
        <>
            <div className="flex pb-2 text-base font-bold text-white">
                <div className="w-8 h-8  flex items-center justify-center"></div>
                <div className="w-8 h-8  flex items-center justify-center"></div>
                <div className="w-8 h-8  flex items-center justify-center"></div>
            </div>
            <h1 className="text-5xl font-semibold text-center">Filter Out the Noise,</h1>
            <h1 className="text-5xl font-semibold mb-6 text-center">Discover Roles That Fit You</h1>
            <h2 className="text-xl text-center">A job tracker that enables you to decide whether to pursue a role in 5 seconds.</h2>
        </>
    )
}

function IntroductionTopExpandableCardComponent() {
    return (
        <div className="mt-16">
            <hr className="border-gray-300 border-t-2"/>
            <ul className="mt-2 space-y-4">
                <li className="text-lg font-bold">
                    - Track applications and previously applied companies.
                </li>
                <li className="flex text-lg font-bold">
                    - Move applications to the 
                    <ArchiveBoxIcon className="size-6 mx-1 text-blue-500" />
                    <p className="text-blue-700">review</p>, 
                    <CheckIcon className="size-6 mx-1 text-green-600" />
                    <p className="text-green-800">completed</p>, or 
                    <TrashIcon className="size-6 mx-1 text-red-500" />
                    <p className="text-red-700">deleted &nbsp;</p>pages.
                </li>
                <li className="text-lg font-bold flex items-center gap-2">
                    - Filter for                     
                        <div className="font-bold h-8 px-2 bg-indigo-400 text-white flex items-center justify-center">Entry</div>
                    , 
                        <div className="font-bold h-8 px-2 bg-emerald-400 text-white flex items-center justify-center">Junior</div>
                    , and
                        <div className="font-bold h-8 px-2 bg-yellow-400 text-white flex items-center justify-center">Mid</div>
                    level roles.
                </li>
            </ul>
            <div className="mt-4">
                <hr className="border-gray-300 border-t-2 mb-2"/>
            </div>
        </div>
    )
}




