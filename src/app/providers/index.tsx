"use client"
import { useSession, signIn } from "next-auth/react"
import Loader from '@/components/Loader';
import { useRouter } from "next/navigation";

export default function UserSessionProvider({
  children
}: {
  children: React.ReactNode,
}) {
  const router = useRouter();
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <body>
        <Loader />
      </body>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return
  }

  return (
    <>
      {children}
    </>
  )
}
