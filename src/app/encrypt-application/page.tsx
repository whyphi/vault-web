"use client";

import { useAuth } from "../contexts/AuthContext";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Listing {
  id: string;
  title: string;
  active: boolean;
  deadline: string;
  isEncrypted: boolean;
  dateCreated: string;
  isVisible: boolean;
}

export default function Users() {
  const { token } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
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
    return <Loader />;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col items-start">
        <h1 className="text-lg font-semibold md:text-2xl">
          Encrypt Application Data
        </h1>
        <p className="text-gray-500 mt-2 md:text-sm">
          Use the toggle switches below to encrypt or decrypt your application
          data. When encryption is enabled, previous application will be
          securely hashed and unreadable on the client-side within WhyPhi.
        </p>
      </div>
      <div className="flex flex-col flex-1 w-full">
        {/* Card Component to show Onboarding Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 mb-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader className="flex justify-between">
                <CardTitle className="text-2xl">{listing.title}</CardTitle>
                <Switch
                  checked={listing.isEncrypted ?? false}
                  onCheckedChange={async () => {
                    try {
                      const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${listing.id}/toggle/encryption`,
                        {
                          method: "PATCH",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      if (response.ok) {
                        setListings((prevListings) =>
                          prevListings.map((item) =>
                            item.id === listing.id
                              ? { ...item, isEncrypted: !item.isEncrypted }
                              : item
                          )
                        );
                      } else {
                        console.error("Failed to toggle encryption");
                      }
                    } catch (error) {
                      console.error("Error toggling encryption:", error);
                    }
                  }}
                />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
