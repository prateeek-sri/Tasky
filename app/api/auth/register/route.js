import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });

    await connectDB();
    
    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    // Simple hash
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ success: true, user: { id: user._id, name } }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
