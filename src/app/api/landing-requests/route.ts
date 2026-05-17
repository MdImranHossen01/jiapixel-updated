import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LandingRequest from "@/models/LandingRequest";
import { getToken } from "next-auth/jwt";

// GET for admin dashboard
export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const skip = (page - 1) * limit;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";
  const filterLastContacted = searchParams.get("filterLastContacted") === "true";

  // Reset contactedToday if it's a new day
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  try {
    // Perform the auto-reset
    await LandingRequest.updateMany(
      { contactedToday: true, updatedAt: { $lt: todayStart } },
      { contactedToday: false }
    );

    let query: any = {};
    let andConditions: any[] = [];

    if (search) {
      andConditions.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ]
      });
    }

    if (status) {
      if (status.includes(',')) {
        query.status = { $in: status.split(',').map(s => s.trim()) };
      } else {
        query.status = status;
      }
    }

    if (source) {
      if (source.includes(',')) {
        query.source = { $in: source.split(',').map(s => s.trim()) };
      } else {
        query.source = source;
      }
    }

    if (filterLastContacted) {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      andConditions.push({
        $or: [
          { lastContacted: { $lt: ninetyDaysAgo } },
          { lastContacted: { $exists: false } },
          { lastContacted: null }
        ]
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const total = await LandingRequest.countDocuments(query);
    const requests = await LandingRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      requests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching landing requests:", error);
    return NextResponse.json(
      { message: "Error fetching requests", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST for user submissions & manual admin insertion
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      phone, 
      details, 
      source, 
      price, 
      status,
      freeOffered,
      quickNote,
      credential,
      lastContacted
    } = body;

    // Basic Validation
    if (!phone) {
      return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }

    const newRequest = new LandingRequest({
      name,
      email,
      phone,
      details,
      source: source || "ecommerce-landing-page",
      price: price || 3500,
      status: status || "requested",
      freeOffered: freeOffered || false,
      quickNote: quickNote || "",
      credential: credential || "",
      lastContacted: lastContacted || null
    });

    await newRequest.save();

    return NextResponse.json(
      { message: "Request created successfully", id: newRequest._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating landing request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error creating request", error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT to update status and other fields (admin only)
export async function PUT(req: NextRequest) {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }
  
    await dbConnect();
  
    try {
      const body = await req.json();
      const { 
        id, 
        status, 
        projectTitle, 
        proposalUrl, 
        freeOffered, 
        contactedToday, 
        quickNote, 
        credential, 
        lastContacted,
        source,
        price
      } = body;
  
      if (!id) {
        return NextResponse.json({ message: "ID is required" }, { status: 400 });
      }

      // Status Whitelist Check
      const allowedStatuses = ["requested", "need contact", "contacted", "confirm", "need to contact again", "ordered", "processing", "delivered", "paid", "canceled", "fake", "hot", "need followup", "a", "b", "c", "d"];
      if (status !== undefined && !allowedStatuses.includes(status)) {
        return NextResponse.json({ message: "Invalid status" }, { status: 400 });
      }

      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (projectTitle !== undefined) updateData.projectTitle = projectTitle;
      if (proposalUrl !== undefined) updateData.proposalUrl = proposalUrl;
      if (freeOffered !== undefined) updateData.freeOffered = freeOffered;
      if (contactedToday !== undefined) updateData.contactedToday = contactedToday;
      if (quickNote !== undefined) updateData.quickNote = quickNote;
      if (credential !== undefined) updateData.credential = credential;
      if (lastContacted !== undefined) updateData.lastContacted = lastContacted;
      if (source !== undefined) updateData.source = source;
      if (price !== undefined) updateData.price = price;
  
      const updatedRequest = await LandingRequest.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
  
      if (!updatedRequest) {
        return NextResponse.json({ message: "Request not found" }, { status: 404 });
      }
  
      return NextResponse.json(updatedRequest);
    } catch (error) {
      console.error("Error updating landing request:", error);
      return NextResponse.json({ message: "Error updating request" }, { status: 500 });
    }
}

// DELETE for cleanup (admin only)
export async function DELETE(req: NextRequest) {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }
  
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
  
    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }
  
    try {
      const deletedRequest = await LandingRequest.findByIdAndDelete(id);
      if (!deletedRequest) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Request deleted successfully" });
    } catch (error) {
      return NextResponse.json({ message: "Error deleting request" }, { status: 500 });
    }
}
