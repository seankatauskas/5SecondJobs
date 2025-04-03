import { auth } from '@/auth'
import UserNavbar from './UserNavbar'
import GuestNavbar from './GuestNavbar'

export default async function Navbar() {
  const session = await auth() // Fetch the session server-side

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
