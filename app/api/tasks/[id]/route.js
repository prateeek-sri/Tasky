import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { getAuthUser } from "@/lib/authMiddleware";


export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { status } = await req.json();
    await connectDB();

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: user.id },
      { status },
      { new: true }
    );

    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: task });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  await Task.findOneAndDelete({ _id: id, userId: user.id });
  
  return NextResponse.json({ success: true });
}
