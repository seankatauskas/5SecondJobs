import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, Cog8ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import SignIn from '@/app/ui/SignIn'

export default function GuestNavbar() {
  return (
    <nav className="top-4 border-4 border-gray-300 bg-white my-4">
      <div className="px-5 md:px-8">
        <div className="relative flex items-center justify-between">
          <div className="flex flex-1 items-center items-stretch justify-start">
            <div className="flex shrink-0 items-center pr-5 md:pr-8">
                <Link className="font-semibold text-2xl" href="/">
                5SecondJobs
                </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center h-full pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <SignIn />
          </div>
        </div>
      </div>
    </nav>
  )
}


