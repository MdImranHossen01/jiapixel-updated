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

  try {
    const requests = await LandingRequest.find({})
      .select("name email phone status source price details projectTitle proposalUrl createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching landing requests:", error);
    return NextResponse.json(
      { message: "Error fetching requests", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST for user submissions
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { name, email, phone, details, source, price } = body;

    // Basic Validation
    if (!name || !email || !phone) {
      return NextResponse.json({ message: "Name, email and phone are required" }, { status: 400 });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    const newRequest = new LandingRequest({
      name,
      email,
      phone,
      details,
      source: source || "ecommerce-landing-page",
      price: price || 3500,
      status: "requested"
    });

    await newRequest.save();

    return NextResponse.json(
      { message: "Request submitted successfully", id: newRequest._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating landing request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error submitting request", error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT to update status (admin only)
export async function PUT(req: NextRequest) {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }
  
    await dbConnect();
  
    try {
      const body = await req.json();
      const { id, status, projectTitle, proposalUrl } = body;
  
      if (!id || !status) {
        return NextResponse.json({ message: "ID and status are required" }, { status: 400 });
      }

      // Status Whitelist Check
      const allowedStatuses = ["requested", "contacted", "confirm", "cancel", "completed"];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { message: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}` },
          { status: 400 }
        );
      }

      const updateData: any = { status };
      if (projectTitle) updateData.projectTitle = projectTitle;
      if (proposalUrl) updateData.proposalUrl = proposalUrl;
  
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
