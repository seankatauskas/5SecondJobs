'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DisclosureButton } from '@headlessui/react'

const navigation = [
  { name: 'search', href: '/search', current: true },
  { name: 'reviewed', href: '/reviewed', current: false },
  { name: 'completed', href: '/completed', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function NavLinks({ isScreenSmall }) {
    const pathname = usePathname()

    let listLinks
    if (isScreenSmall) {
        listLinks = navigation.map((item) => (
            <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                    item.href === pathname ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-5 py-1 text-base font-medium',
                )}
            >
                {item.name}
            </DisclosureButton>
        ))
    } else {
        listLinks = navigation.map((item) => (
            <Link
                key={item.name}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                    item.href === pathname ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-700 hover:text-white',
                    'px-3 py-2 text-base font-medium',
                )}
            >
                {item.name}
            </Link>
        ))
    }
    return (
        <>
        {listLinks}
        </>
    )
}
