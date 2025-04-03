import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/search" })
      }}
    >
      <button type="submit" className="text-base font-medium text-gray-600 px-3 py-2 hover:bg-gray-700 hover:text-white">Log in</button>
    </form>
  )
} 
