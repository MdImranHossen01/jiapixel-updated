import BillViewClient from "./BillViewClient";

export const metadata = {
  title: "View Invoice | JiaPixel",
  description: "View and print your invoice.",
};

export default async function PublicBillPage(props: { params: Promise<{ invoiceNo: string }> }) {
  const params = await props.params;

  return (
    <div className="min-h-screen bg-muted/30 pt-20 pb-10">
      <BillViewClient invoiceNo={params.invoiceNo} />
    </div>
  );
}
