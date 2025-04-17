"use client"

import { IntroductionCard } from "@/app/ui/IntroductionCard"

export default function GuestApplicationsDisplay() {
  return (
    <div className="w-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <IntroductionCard className="mb-4" />
      </div>
    </div>
  )
}

