"use client"

// import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip";

import Link from "next/link"
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  Siren
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation";
import UserSessionProvider from "./providers";

import { signOut } from "next-auth/react"

import { AuthProvider } from "./contexts/AuthContext";


// const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <html lang="en">
        <SessionProvider>
          <body className={"min-w-screen"}>
            {children}
          </body>
        </SessionProvider>
      </html>
    )
  }

  return (
    <html lang="en">
      <SessionProvider>
        <AuthProvider>
          <UserSessionProvider>
            <body className={"min-w-screen"}>
              <TooltipProvider>
                <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                  <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                          <img src="/pct-logo.png" className="h-8" alt="PCT Logo" />
                          <span className="">WhyPhi</span>
                        </Link>
                      </div>
                      <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                          <Link
                            href="#"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                          >
                            <Home className="h-4 w-4" />
                            Home
                          </Link>
                          <Link
                            href="/users"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                          >
                            <Users className="h-4 w-4" />
                            Users
                          </Link>
                          <Link
                            href="/permissions"
                            className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                          >
                            <Siren className="h-4 w-4" />
                            Manage Permissions{" "}
                          </Link>
                        </nav>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                          >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                          <nav className="grid gap-2 text-lg font-medium">
                            <Link
                              href="#"
                              className="flex items-center gap-2 text-lg font-semibold"
                            >
                              <img src="/pct-logo.png" className="h-10" alt="PCT Logo" />
                              <span className="sr-only">WhyPhi</span>
                            </Link>
                            <Link
                              href="#"
                              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                            >
                              <Home className="h-5 w-5" />
                              Home
                            </Link>
                            <Link
                              href="/users"
                              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                            >
                              <Users className="h-5 w-5" />
                              Users
                            </Link>
                            <Link
                              href="/permissions"
                              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                            >
                              <Siren className="h-5 w-5" />
                              Manage Permissions{" "}
                            </Link>
                          </nav>
                          <div className="mt-auto">
                            {/* <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card> */}
                          </div>
                        </SheetContent>
                      </Sheet>
                      <div className="w-full flex-1">
                        {/* <form>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                          />
                        </div>
                      </form> */}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Settings</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </header>
                    {children}
                  </div>
                </div>
              </TooltipProvider>
            </body>
          </UserSessionProvider>
        </AuthProvider>
      </SessionProvider>
    </html>
  );
}
