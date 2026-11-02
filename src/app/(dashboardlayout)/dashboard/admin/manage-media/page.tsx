import { R2MediaCleaner } from "@/components/admin/R2MediaCleaner";

export const metadata = {
  title: "Cloudflare R2 Media & Storage Cleaner | Admin Dashboard",
  description: "Scan and purge orphaned and unused images from Cloudflare R2",
};

export default function ManageMediaPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Media & Cloudflare R2 Storage</h1>
        <p className="text-sm text-muted-foreground">
          Manage your cloud assets and clean up orphaned images to optimize storage costs.
        </p>
      </div>
      <R2MediaCleaner />
    </div>
  );
}
