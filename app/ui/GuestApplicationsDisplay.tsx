"use client"

import { IntroductionCard } from "@/app/ui/IntroductionCard"
import ExpandingCard from "@/app/ui/ExpandingCard"

export default function GuestApplicationsDisplay() {
  return (
    <div className="w-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <IntroductionCard className="mb-4" />
        <ExpandingCard />
      </div>
    </div>
  )
}

