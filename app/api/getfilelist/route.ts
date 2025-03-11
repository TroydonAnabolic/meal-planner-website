import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const GET = async (req: NextRequest) => {
  try {
    const files = fs.readdirSync(path.join(process.cwd(), "documents"));
    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    console.error("Error reading files:", error);
    return NextResponse.json(
      { error: "Failed to read files" },
      { status: 500 }
    );
  }
};
