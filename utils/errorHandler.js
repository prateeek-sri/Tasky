import { NextResponse } from "next/server";

export const handleError = (error) => {
  console.error("API Error:", error);

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err) => err.message);
    return NextResponse.json({ success: false, error: messages.join(", ") }, { status: 400 });
  }

  if (error.code === 11000) {
    return NextResponse.json({ success: false, error: "Duplicate field value entered" }, { status: 400 });
  }

  return NextResponse.json(
    { success: false, error: error.message || "Internal Server Error" },
    { status: error.status || 500 }
  );
};
