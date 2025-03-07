import { NextResponse } from "next/server";
import db from "@/lib/db";
import { workouts } from "@lifter/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  // await is required in NextJs 15+
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const userWorkouts = await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, Number(userId)));

  return NextResponse.json(userWorkouts);
}
