import { db } from "@/db";
import { deedTable } from "@/db/schema";
import { formatDate, startOfToday, subMonths } from "date-fns";
import { lt } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const specialCode = process.env.SPECIAL_CODE!;

export async function DELETE() {
  const headersList = await headers();
  const code = headersList.get("code");

  if (code === specialCode) {
    const formattedDate = formatDate(
      subMonths(startOfToday(), 1),
      "yyyy-MM-dd"
    );
    await db.delete(deedTable).where(lt(deedTable.date, formattedDate));

    return NextResponse.json({ status: 200 });
  } else {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }
}
