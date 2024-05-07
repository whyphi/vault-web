"use client"

import { useAuth } from "../contexts/AuthContext"
import Loader from "@/components/Loader"
import { useState, useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import { BarList, Card } from '@tremor/react';


import { Progress } from "@/components/ui/progress";

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

export default function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([])
  const [pages, setPages] = useState<any[]>([])
  const [extended, setExtended] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/monitoring/visited-pages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPages(data.topWebsitePages);
        setIsLoading(false);
      });
  }, []);


  const valueFormatter = (number: number) =>
    `${Intl.NumberFormat('us').format(number).toString()}`;

  if (isLoading) {
    return <Loader />
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Monitoring</h1>
      </div>
      <div
        className="flex flex-col flex-1 w-full"
      >
        {/* Card Component to show Onboarding Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 mb-4">
          <>
            <Card className="p-0 sm:mx-auto sm:max-w-lg">
              <div className="flex items-center justify-between border-b border-tremor-border p-6 dark:border-dark-tremor-border">
                <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Top 10 Pages (Last 30 days)
                </p>
                <p className="text-tremor-label font-medium uppercase text-tremor-content dark:text-dark-tremor-content">
                  Visitors
                </p>
              </div>
              <div
                // className={`overflow-hidden p-6 ${extended ? '' : 'max-h-[260px]'}`}
                className="overflow-hidden p-6"
              >
                <BarList data={pages} valueFormatter={valueFormatter} />
              </div>
              {/* 
              <div
                className={`flex justify-center ${extended
                  ? 'px-6 pb-6'
                  : 'absolute inset-x-0 bottom-0 rounded-b-tremor-default bg-gradient-to-t from-tremor-background to-transparent py-7 dark:from-dark-tremor-background'
                  }`}
              >
                <button
                  className="flex items-center justify-center rounded-tremor-small border border-tremor-border bg-tremor-background px-2.5 py-2 text-tremor-default font-medium text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input hover:dark:bg-dark-tremor-background-muted"
                  onClick={() => setExtended(!extended)}
                >
                  {extended ? 'Show less' : 'Show more'}
                </button>
              </div> */}
            </Card>
          </>

        </div>
      </div>
    </main>
  )
}