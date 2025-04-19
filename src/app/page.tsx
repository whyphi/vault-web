"use client"

import { Button } from "@/components/ui/button"

import { Metadata } from 'next';
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const metadata: Metadata = {
  title: 'Vault',
}

type Issue = {
  EventName: string;
  EventMessage: string;
  LastOccurred: string;
  EventShortId: string;
  EventCount: number;
  ErrorLink: string;
}

const dummyIssues: Issue[] = [
  {
    EventName: "Error 1",
    EventMessage: "Message 1",
    LastOccurred: "2022-01-01",
    EventShortId: "WHYPHI-ZAP-1",
    EventCount: 1,
    ErrorLink: "#",
  },
  {
    EventName: "Error 2",
    EventMessage: "Message 2",
    LastOccurred: "2022-01-02",
    EventShortId: "WHYPHI-ZAP-1",
    EventCount: 2,
    ErrorLink: "#",
  },
  {
    EventName: "Error 3",
    EventMessage: "Message 3",
    LastOccurred: "2022-01-03",
    EventShortId: "WHYPHI-ZAP-1",
    EventCount: 3,
    ErrorLink: "#",
  },
]

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Home</h1>
      </div>
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Issues</CardTitle>
            <CardDescription>
              Most recent issues raised by Sentry
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="https://pct-tech-team.sentry.io/issues/">
              View Sentry
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issues</TableHead>
                <TableHead className="text-right">Last Occurred</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Maps out issues */}
              {dummyIssues.map((issue) => (
                <TableRow key={issue.EventShortId} className="hover:cursor-pointer" onClick={() => window.open(issue.ErrorLink, '_blank')}>

                  <TableCell>
                    <div className="font-medium">{issue.EventName}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {issue.EventMessage}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {issue.LastOccurred}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="justify-center border-t p-4">
          <Button size="sm" variant="ghost" className="gap-1">
            {/* <PlusCircle className="h-3.5 w-3.5" /> */}
            See More ...
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

// 