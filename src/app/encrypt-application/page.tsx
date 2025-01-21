"use client"

import { useAuth } from "../contexts/AuthContext"
import Loader from "@/components/Loader"
import { useState, useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Users() {
  const { token } = useAuth();
  const [listings, setListings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setListings(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching listings:", error));
  }, []);

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col items-start">
        <h1 className="text-lg font-semibold md:text-2xl">Encrypt Application Data</h1>
        <p className="text-gray-500 mt-2 md:text-sm">Switch the toggle for application to proceed with client-side encryption. When a user loads a previous application, all the data will be hashed so it will be unreadable.</p>
      </div>
      <div
        className="flex flex-col flex-1 w-full"
      >
        {/* Card Component to show Onboarding Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 mb-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader className="flex justify-between">
                <CardTitle className="text-2xl">{listing.title}</CardTitle>
                <Switch checked={listing.isEncrypted ?? false} />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}