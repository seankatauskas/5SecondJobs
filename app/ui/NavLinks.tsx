'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DisclosureButton } from '@headlessui/react'

const navigation = [
  { name: 'jobs', href: '/jobs' },
  { name: 'saved', href: '/saved' },
  { name: 'completed', href: '/completed' },
]

type NavLinksProps = {
  isScreenSmall: boolean
}

export default function NavLinks({ isScreenSmall }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <>
      {navigation.map((item) => {
        const isActive = item.href === pathname

        const baseClasses = 'text-base font-medium'
        const padding = isScreenSmall ? 'block px-5 py-1' : 'px-3 py-2'
        const active = 'bg-gray-900 text-white'
        const inactive = isScreenSmall
          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
          : 'text-gray-600 hover:bg-gray-700 hover:text-white'

        const finalClass = `${isActive ? active : inactive} ${padding} ${baseClasses}`

        return isScreenSmall ? (
          <DisclosureButton
            key={item.name}
            as="a"
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={finalClass}
          >
            {item.name}
          </DisclosureButton>
        ) : (
          <Link
            key={item.name}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={finalClass}
          >
            {item.name}
          </Link>
        )
      })}
    </>
  )
}

