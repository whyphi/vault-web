"use client"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { useAuth } from "../contexts/AuthContext"
import React, { useState, useEffect, useCallback } from "react"
import Loader from "@/components/Loader"

import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { UserWithRoles } from "@/types/users"

export default function Permissions() {

  const { token } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([])
  const [filterText, setFilterText] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const roles = [
    {
      name: "admin",
      label: "Admin",
    },
    {
      name: "eboard",
      label: "E-Board",
    },
    {
      name: "member",
      label: "Member",
    },
    {
      name: "recruitment",
      label: "Recruitment",
    },
  ] as const

  const filterByString = useCallback((user: UserWithRoles) => {
    return user.name.toLowerCase().includes(filterText.toLowerCase())
  }, [filterText])

  const mapRolesToArray = (role_map: Record<string, boolean>) => {
    return Object.keys(role_map).filter((role) => role_map[role])
  }

  const handleSubmit = (event: React.FormEvent) => {

    event.preventDefault()

    if (!selectedUser) {
      console.error("No user selected.");
      return;
    }

    setIsSaving(true);

    const roles = mapRolesToArray(selectedUser.role_map)
    const body = JSON.stringify({
      roles,
    })

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/members/${selectedUser.id}/roles`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
    })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, role_map: selectedUser.role_map, roles: roles } : user
          )
        )

      })
      .then(() => {
        toast(`${selectedUser.name}'s roles have been updated`, {
          description: new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false }),
          action: {
            label: "Close",
            onClick: () => ({}),
          },
        })
      })
      .catch((error) => {
        toast.error(error, {
          description: new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false }),
        });
      })
      .finally(() => {
        setSelectedUser(null);
        setIsSaving(false);
      })
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/members`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const usersWithRoles = data.map((user: UserWithRoles) => {
          const role_map: { [key: string]: boolean } = {};
          roles.forEach((role) => {
            role_map[role.name] = user.user_roles.some((ur) => ur.role.name === role.name);
          });
          return {
            ...user,
            role_map,
          };
        });
        setUsers(usersWithRoles);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching listings:", error);
        toast.error(error, {
          description: new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false }),
        });
      });

  }, []);

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Manage Permissions</h1>
      </div>
      <div className="flex gap-2 mb-2">
        <Input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter by name"
        />
      </div>
      <div>
        <Toaster />
        <Dialog>
          <DialogTrigger asChild>
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-1">
                {users.filter(filterByString).map((user) => (
                  <div
                    key={user.email}
                    className="flex pt-3 pb-3  items-center gap-4 justify-between transition duration-200 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        {/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-end">
                      <div className="ml-auto font-medium text-left">Roles</div>
                      <p className="text-sm text-muted-foreground">
                        {user.user_roles.map((user_role, index) => (
                          <React.Fragment key={index}>
                            {index > 0 ? ', ' : ''}
                            {user_role.role.name.charAt(0).toUpperCase() + user_role.role.name.slice(1)}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </DialogTrigger>
          {selectedUser && (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Permissions</DialogTitle>
                <DialogDescription>
                  Make changes to <strong>{selectedUser.name}</strong>'s permissions here. Click save when you're done.`
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="py-4 flex flex-col">
                  {roles.map(role => {
                    return (
                      <div key={role.name} className="flex items-center mb-3 gap-3">
                        <Checkbox
                          id={role.name}
                          name={role.name}
                          checked={selectedUser.role_map[role.name]}
                          onCheckedChange={(checked) => {
                            setSelectedUser((prev) => {
                              if (!prev) return prev; 
                              return {
                                ...prev,
                                role_map: {
                                  ...prev.role_map,
                                  [role.name]: Boolean(checked),
                                },
                              }
                            })
                          }}
                        />
                        <label
                          htmlFor={role.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {role.label}
                        </label>
                      </div>
                    )
                  })}
                </div>
                <DialogFooter>
                  <Button disabled={isSaving} type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </main>
  )
}
