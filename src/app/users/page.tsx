"use client"

import { useAuth } from "../contexts/AuthContext"
import Loader from "@/components/Loader"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

export default function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "name", },
    { field: "email" },
    { field: "college" },
    { field: "major" },
    { field: "minor" },
    { field: "team" },
    { field: "graduationYear" },
    { field: "family" },
    { field: "isEboard" },
    { field: "isNewUser" },
    { field: "class" },
  ]);

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

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
      </div>
      <div
        className="flex flex-col flex-1 justify-center w-full"
      >
        {/* Card Component to show Onboarding Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="max-w-sm">Number of Users Onboarded</CardDescription>
              <CardTitle className="text-4xl">
                {users.filter((user) => user.isNewUser === false && user.isNewUser !== undefined).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                out of {users.length} Users
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={
                  (users.filter(
                    (user) => user.isNewUser === false && user.isNewUser !== undefined
                  ).length / users.length) * 100
                }
                aria-label="Percentage of Members who have completed onboarding"
              />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Reset Onboarding Status</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                New Semester? Reset all users' onboarding status to get the most up-to-date information.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button disabled>Reset Onboarding</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="flex flex-col items-center gap-1 text-center w-full">
          <div
            className="ag-theme-quartz" // applying the grid theme
            style={{ height: "80vh", width: "100%" }} // the grid will fill the size of the parent container
          >
            <AgGridReact
              rowData={users}
              columnDefs={colDefs}
            />
          </div>
        </div>
      </div>
    </main>
  )
}