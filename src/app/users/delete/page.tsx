"use client"

import { useAuth } from "../../contexts/AuthContext"
import { useState, useEffect } from "react"
import { Slash } from "lucide-react"

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
        <div className="flex items-center">
          {/* <h1 className="text-lg font-semibold md:text-2xl">Add User</h1> */}
        </div>
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
                          {searchedUsers.map((user) => (
                            <>
                              <div
                                key={user._id}
                                className={
                                  "py-2 text-sm cursor-pointer select-none hover:bg-neutral-100 hover:dark:bg-neutral-800 " +
                                  (selectedUsers.some((u) => u._id === user._id)
                                    ? "bg-neutral-300 dark:bg-neutral-700"
                                    : "")
                                }
                                onClick={() => {
                                  if (selectedUsers.some((u) => u._id === user._id)) {
                                    setSelectedUsers(
                                      selectedUsers.filter((u) => u._id !== user._id)
                                    );
                                  } else {
                                    setSelectedUsers([...selectedUsers, user]);
                                  }
                                  setSearchValue("");
                                }}
                              >

                                {user.name}
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
                    <div key={user._id} className="text-sm">
                      {user.name}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-neutral-500">No users selected</div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
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


