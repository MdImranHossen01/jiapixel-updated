import { IconFiles, IconBriefcase, IconCategory, IconArticle, IconCoin } from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  stats: {
    totalCategories: number;
    totalServices: number;
    totalBlogs: number;
    totalPortfolios: number;
    totalReceivable: number;
  }
}

export function SectionCards({ stats }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-3 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Categories</CardDescription>
            <IconCategory className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.totalCategories}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Services</CardDescription>
            <IconBriefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.totalServices}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Blogs</CardDescription>
            <IconArticle className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.totalBlogs}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Portfolios</CardDescription>
            <IconFiles className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.totalPortfolios}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card bg-amber-50/50 dark:bg-amber-950/10 border-amber-200/50 dark:border-amber-900/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="text-amber-800 dark:text-amber-300 font-medium">Total Receivable</CardDescription>
            <IconCoin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums text-amber-900 dark:text-amber-200">
            ৳{stats.totalReceivable?.toLocaleString()}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
