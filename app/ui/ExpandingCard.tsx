import { useState } from 'react'
import { motion } from 'framer-motion'
import { BaseCardComponent, TopExpandableCardComponent, BottomExpandableCardComponent } from "@/app/ui/cards"
import { data } from "@/app/lib/demoCardData"

export default function ExpandingCard() {

  return (
    <motion.div 
        className="border-4 border-gray-300 px-5 md:px-8 pb-6 mb-8">
      <div>
        <BaseCardComponent data={data} demo={true} />
      </div>
        <motion.div>
          <TopExpandableCardComponent data={data} />
          <BottomExpandableCardComponent data={data} />
        </motion.div>
    </motion.div>
  );
}

