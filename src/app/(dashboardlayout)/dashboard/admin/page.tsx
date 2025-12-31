import { SectionCards } from "@/components/section-cards"
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Portfolio from "@/models/Portfolios";

// Force dynamic behavior so it fetches fresh data on every request
export const dynamic = 'force-dynamic';

export default async function Page() {
  await dbConnect();

  const [totalCategories, totalServices, totalBlogs, totalPortfolios] = await Promise.all([
    Category.countDocuments({}),
    Project.countDocuments({}),
    Blog.countDocuments({}),
    Portfolio.countDocuments({}),
  ]);

  const stats = {
    totalCategories,
    totalServices,
    totalBlogs,
    totalPortfolios
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards stats={stats} />
          {/* 
              These components are placeholders for now until we have real chart/table data logic 
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={[]} /> 
              */}
        </div>
      </div>
    </div>
  )
}
