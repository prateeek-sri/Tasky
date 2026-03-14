import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authMiddleware";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(authUser.id).select("-password");
  return NextResponse.json({ success: true, user });
}

export async function PUT(req) {
  const authUser = await getAuthUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, avatar } = await req.json();
  await connectDB();
  
  const user = await User.findByIdAndUpdate(
    authUser.id, 
    { name, avatar }, 
    { new: true }
  ).select("-password");

  return NextResponse.json({ success: true, user });
}
