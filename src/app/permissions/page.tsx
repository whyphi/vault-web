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

export default function Permissions() {

  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([])
  const [filterText, setFilterText] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const roles = [
    {
      id: "admin",
      label: "Admin",
    },
    {
      id: "eboard",
      label: "E-Board",
    },
    {
      id: "member",
      label: "Member",
    },
    {
      id: "recruitment",
      label: "Recruitment",
    },
  ] as const

  const filterByString = useCallback((user: any) => {
    return user.name.toLowerCase().includes(filterText.toLowerCase())
  }, [filterText])

  const mapRolesToArray = (rolesMap: Record<string, boolean>) => {
    return Object.keys(rolesMap).filter((role) => rolesMap[role])
  }

  const handleSubmit = (event: React.FormEvent) => {

    event.preventDefault()
    setIsSaving(true);
    const roles = mapRolesToArray(selectedUser.rolesMap)
    const body = JSON.stringify({
      roles,
    })

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/members/${selectedUser._id}/roles`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
    })
      .then(() => {
        setUsers((prevUsers: any) =>
          prevUsers.map((user: any) =>
            user._id === selectedUser._id ? { ...user, rolesMap: selectedUser.rolesMap, roles: roles } : user
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
        const usersWithRoles = data.map((user: any) => {
          const rolesMap: { [key: string]: boolean } = {};
          roles.forEach((role) => {
            rolesMap[role.id] = user.roles ? user.roles.includes(role.id) : false;
          });
          return {
            ...user,
            rolesMap,
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
                        {user.roles && user.roles.map((role: string, index: number) => (
                          <React.Fragment key={role}>
                            {index > 0 ? ', ' : ''}
                            {role.charAt(0).toUpperCase() + role.slice(1)}
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
                      <div key={role.id} className="flex items-center mb-3 gap-3">
                        <Checkbox
                          id={role.id}
                          name={role.id}
                          checked={selectedUser.rolesMap![role.id] || false}
                          onCheckedChange={(event) => {
                            setSelectedUser((prev: any) => ({
                              ...prev,
                              rolesMap: {
                                ...prev.rolesMap,
                                [role.id]: event.valueOf(),
                              },
                            }))
                          }}
                        />
                        <label
                          htmlFor={role.id}
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
