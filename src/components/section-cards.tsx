import { IconFiles, IconBriefcase, IconCategory, IconArticle } from "@tabler/icons-react"

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
  }
}

export function SectionCards({ stats }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
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
    </div>
  )
}
