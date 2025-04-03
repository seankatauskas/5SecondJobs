import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, Cog8ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'
import SignOut from './SignOut'
import NavLinks from '@/app/ui/NavLinks';
import Link from 'next/link'


export default function UserNavbar() {
  return (
    <Disclosure as="nav" className="sticky top-4 border-4 border-gray-300 bg-white my-4">
      <div className="px-5 md:px-8">
        <div className="relative flex items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center text-gray-400">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center pr-5 md:pr-8">
                <Link className="font-semibold text-2xl" href="/">
                5SecondJobs
                </Link>
            </div>
            <div className="hidden sm:block">
              <div className="flex">
                <NavLinks isScreenSmall={false} />
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center h-full pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="cursor-pointer hover:bg-gray-700 px-2 py-1 text-gray-600 hover:text-white">
                <button
                  type="button"
                  className="flex items-center justify-center"
                >
                  <span className="sr-only">Settings</span>
                  <Cog8ToothIcon aria-hidden="true" className="size-6" />
                </button>
            </div>
            <SignOut />
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className=" pt-2 ">
            <NavLinks isScreenSmall={true} />
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

