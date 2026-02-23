import connectDB from "./src/lib/db";
import CustomOrder from "./src/models/CustomOrder";

async function run() {
    await connectDB();
    const orders = await CustomOrder.find().lean();
    console.log(`Found ${orders.length} custom orders.`);
    orders.forEach(o => console.log(`Slug: ${o.shareableSlug}, Status: ${o.status}`));
    process.exit(0);
}

run();
