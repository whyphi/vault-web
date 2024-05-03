export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

async function getTopWebsitePages(apiKey: string, projectId: string) {
  const dashboardResponse = await fetch(
    `https://us.posthog.com/api/projects/${projectId}/query/44fbca64-53e6-4e8b-800a-66ab5d64b562/
    `,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  )

  const queryData = await dashboardResponse.json()


  const topWebsitePagesResult = queryData.results.results
    .filter((data: any) => data.label.startsWith('https'))
    .sort((a: any, b: any) => b.aggregated_value - a.aggregated_value)
    .slice(0, 10)
    .map((data: any) => {
      return {
        name: data.label,
        value: data.aggregated_value,
      };
    });

  return topWebsitePagesResult;
}

export async function GET() {
  const apiKey = process.env.POSTHOG_API_KEY
  const projectId = process.env.POSTHOG_PROJECT_ID

  if (!apiKey || !projectId) {
    return NextResponse.json({ error: 'Missing API key or project ID' }, { status: 500 })
  }

  const response = await fetch(
    `https://us.posthog.com/api/projects/${projectId}/insights/`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  )

  const data = await response.json()

  if (!data) {
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 })
  }

  const insights = data.results.map((insight: any) => {
    if (insight.name === 'Top Website Pages (Overall)') {
      return insight
    }
  }).filter(Boolean)[0]

  if (!insights) {
    return NextResponse.json({ error: 'Failed to find insights' }, { status: 500 })
  }

  const topWebsitePages = await getTopWebsitePages(apiKey, projectId)

  return Response.json({
    topWebsitePages: topWebsitePages
  })
}

