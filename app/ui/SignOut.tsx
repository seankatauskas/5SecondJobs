import { signOut } from "@/auth.ts"
 
export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({ redirectTo: "/" })
      }}
    >
      <button type="submit" className="text-base font-medium text-gray-600 px-3 py-2 hover:bg-gray-700 hover:text-white">log out</button>
    </form>
  )
}
