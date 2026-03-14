import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: "Wrong password" }, { status: 401 });

    // Create Token
    const token = signToken({ id: user._id, name: user.name });

    // Save in Cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, { httpOnly: true, secure: true, path: "/" });

    return NextResponse.json({ success: true, user: { id: user._id, name: user.name } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
