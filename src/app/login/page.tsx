"use client"

import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>
            Sign-in with Google to login to WhyPhi's Vault App
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">

            <Button variant="outline" className="w-full flex items-center" onClick={() => signIn("google", { callbackUrl: "/" })}>
              <img className="mr-2 w-4 h-4" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"></img>
              Sign up with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Not working? Contact PCT Tech Team!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
