import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Client from "@/models/Client";
import Bill from "@/models/Bill";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Get unique clients from Bill collection (latest details first)
    const billClients = await Bill.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: { $toLower: "$clientEmail" },
          name: { $first: "$clientName" },
          email: { $first: "$clientEmail" },
          phone: { $first: "$clientPhone" },
          address: { $first: "$clientAddress" },
          businessName: { $first: "$businessName" }
        }
      }
    ]);

    // 2. Get users from User collection
    const users = await User.find({ role: "user" }).lean();

    // 3. Get clients from Client collection
    const clients = await Client.find().lean();

    // Merge them by email
    const registryMap = new Map<string, {
      name: string;
      email: string;
      phone: string;
      address: string;
      businessName: string;
    }>();

    // Insert bill clients first
    billClients.forEach((bc) => {
      if (!bc.email) return;
      const email = bc.email.toLowerCase().trim();
      registryMap.set(email, {
        name: bc.name || "",
        email: bc.email,
        phone: bc.phone || "",
        address: bc.address || "",
        businessName: bc.businessName || ""
      });
    });

    // Merge clients
    clients.forEach((c: any) => {
      const emails = Array.isArray(c.email) ? c.email : [c.email];
      emails.forEach((emailStr: string) => {
        if (!emailStr) return;
        const email = emailStr.toLowerCase().trim();
        const existing = registryMap.get(email);
        const phone = (c.socialLinks?.whatsapp && c.socialLinks.whatsapp.length > 0)
          ? c.socialLinks.whatsapp[0]
          : "";

        registryMap.set(email, {
          name: existing?.name || c.name || "",
          email: emailStr,
          phone: existing?.phone || phone || "",
          address: existing?.address || "",
          businessName: existing?.businessName || c.businessName || ""
        });
      });
    });

    // Merge users
    users.forEach((u: any) => {
      if (!u.email) return;
      const email = u.email.toLowerCase().trim();
      if (!registryMap.has(email)) {
        registryMap.set(email, {
          name: u.name || "",
          email: u.email,
          phone: "",
          address: "",
          businessName: ""
        });
      }
    });

    const suggestions = Array.from(registryMap.values());

    return NextResponse.json({ success: true, data: suggestions });
  } catch (error: any) {
    console.error("Error fetching client suggestions:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
