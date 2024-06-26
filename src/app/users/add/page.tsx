"use client"

import { useAuth } from "../../contexts/AuthContext"
import { useState } from "react"
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

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { roles } from "@/app/common/permissions"

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email" })
    .refine(
      (email) => email.endsWith("@bu.edu"),
      { message: "Email must end in @bu.edu" }
    ),
  roles: z.array(z.string()).refine((roles) => roles.some((item: any) => item), {
    message: "You have to select at least one item.",
  }),
})


export default function AddUser() {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      roles: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    })
      .then(async (response) => {
        const responseJson = await response.json();
        if (!response.ok) {
          // if res.Message exists throw res.Message else throw statustext
          const errorMessage = responseJson.Message || response.statusText;
          throw new Error(errorMessage);
        }
        form.setValue("name", "")
        form.setValue("email", "")
        form.setValue("roles", [])
        setIsSubmitting(false);
        toast(`${values.name} has been added.`, {
          description: new Date().toLocaleString("en-US", {
            timeZone: "America/New_York",
            hour12: false,
          }),
          action: {
            label: "Close",
            onClick: () => ({}),
          },
        })
      })
      .catch((error) => {
        setIsSubmitting(false);
        toast.error(`Error adding user: ${error.message}`, {
          action: {
            label: "Close",
            onClick: () => ({}),
          },
        })
      })
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
            <BreadcrumbPage>Add User</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center">
        {/* <h1 className="text-lg font-semibold md:text-2xl">Add User</h1> */}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Add User</CardTitle>
            <CardDescription>
              Give a new user access to WhyPhi-related platforms and projects.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CardContent>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the user's name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="whyphi@bu.edu" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a BU-affiliated email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br />
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Select Roles</p>
                {roles.map((role) => (
                  <FormField
                    key={role.id}
                    control={form.control}
                    name="roles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={role.id}
                          className="flex flex-row items-start space-x-3 space-y-0 mt-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(role.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, role.id])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== role.id
                                    )
                                  )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {role.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button disabled={isSubmitting} type="submit">Add User</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </main>
  )
}

