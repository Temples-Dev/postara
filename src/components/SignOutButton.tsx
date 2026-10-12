import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { authClient } from "../lib/auth-client"
import { useNavigate } from "react-router-dom"

export function SignOutButton() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await authClient.signOut()
    navigate("/signin")
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  )
}
