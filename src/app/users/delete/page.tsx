"use client"

import { useAuth } from "../../contexts/AuthContext"
import { useState, useEffect } from "react"
import { Slash, XOctagonIcon } from "lucide-react"


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import Loader from "@/components/Loader"


export default function DeleteUser() {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/members`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching listings:", error));
  }, []);


  const DeleteUserComponent = ({ users }: { users: any }) => {
    const [searchValue, setSearchValue] = useState("")
    const [searchedUsers, setSearchedUsers] = useState<any[]>([])
    const [selectedUsers, setSelectedUsers] = useState<any[]>([])

    return (
      <>
        <div className="flex flex-col gap-2 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Delete User</CardTitle>
              <CardDescription>
                Give a new user access to WhyPhi-related platforms and projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <Input
                    type="text"
                    placeholder="Search users..."
                    className="flex-1 px-3 py-3 "
                    value={searchValue}
                    onChange={(event) => {
                      setSearchValue(event.target.value)
                      setSearchedUsers(
                        users.filter(
                          (user: any) =>
                            user.name
                              .toLowerCase()
                              .includes(event.target.value.toLowerCase())
                        )
                      );
                    }}
                  />
                  {searchValue !== "" && searchedUsers.length > 0 && (
                    <div
                      className="fixed mt-14 z-50 w-80 rounded-md border border-neutral-200 bg-white p-1 text-neutral-950 shadow-md outline-none"
                      style={{ marginRight: "3rem" }}
                    >
                      <ScrollArea
                        className="h-72"
                      >
                        <div className="p-4">
                          {searchedUsers
                            .filter((user) => !selectedUsers.some((u) => u._id === user._id))
                            .map((user) => (
                              <>
                                <div
                                  key={user._id}
                                  className={
                                    "py-2 text-sm cursor-pointer select-none hover:bg-neutral-100 hover:dark:bg-neutral-800 "
                                  }
                                  onClick={() => {
                                    setSelectedUsers([...selectedUsers, user]);
                                    setSearchValue("");
                                  }}
                                >

                                  {user.name} <span className="text-neutral-500 dark:text-neutral-300">({user.email})</span>
                                </div>
                                <Separator className="" />
                              </>
                            ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="mb-4 text-sm font-medium leading-none">
                  Users to be deleted
                </h4>
                {selectedUsers.length > 0 ? (
                  selectedUsers.map((user) => (
                    <div key={user._id} className="flex items-center mt-1">
                      <button
                        className="mr-2 focus:outline-none"
                        onClick={() =>
                          setSelectedUsers(
                            selectedUsers.filter((u) => u._id !== user._id)
                          )
                        }
                      >
                        <XOctagonIcon className="w-4 h-4 text-red-400" />
                      </button>
                      <div className="text-sm flex items-center">
                        {user.name}
                        <span className="ml-2 text-neutral-500 dark:text-neutral-300">({user.email})</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-neutral-500">No users selected</div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={selectedUsers.length === 0}
              // loading={isSubmitting}
              // onClick={async () => {
              //   setIsSubmitting(true);
              //   try {
              //     await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/members/bulk-delete`, {
              //       method: "DELETE",
              //       headers: {
              //         "Content-Type": "application/json",
              //         Authorization: `Bearer ${token}`,
              //       },
              //       body: JSON.stringify(selectedUsers.map((user) => user._id)),
              //     });
              //     toast.success("Users deleted successfully");
              //     setSelectedUsers([]);
              //   } catch (error) {
              //     console.error(error);
              //     toast.error("Error deleting users:", error);
              //   } finally {
              //     setIsSubmitting(false);
              //   }
              // }}
              >
                Delete selected users
              </Button>
            </CardFooter>
          </Card>
        </div>
      </>
    )
  }



  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Toaster />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/users">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Delete User</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? <Loader /> : <DeleteUserComponent users={users} />}

    </main>
  )
}


