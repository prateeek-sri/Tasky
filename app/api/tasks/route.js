import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { getAuthUser } from "@/lib/authMiddleware";
import { encrypt, decrypt } from "@/lib/crypto";

export async function GET(req) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    // Build query
    let query = {
      userId: user.id,
    };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (status !== "all") {
      query.status = status;
    }

    // Count total tasks
    const totalTasks = await Task.countDocuments(query);

    // Fetch paginated tasks
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Decrypt descriptions
    const data = tasks.map((t) => ({
      ...t.toObject(),
      description: decrypt(t.description),
    }));

    return NextResponse.json({
      success: true,
      data,
      page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
    });

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, status } = await req.json();
    await connectDB();

    const task = await Task.create({
      title,
      description: encrypt(description),
      userId: user.id,
      status: status || "pending",
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
