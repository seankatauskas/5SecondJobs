import { auth } from '@/auth'
import UserNavbar from './UserNavbar'
import GuestNavbar from './GuestNavbar'

export default async function Navbar() {
  const session = await auth() 

  return (
    <>
      {session ? (
      <UserNavbar />
      ) : (
      <GuestNavbar />
      )}
    </>
  )
}
