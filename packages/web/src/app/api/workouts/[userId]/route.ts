import { NextResponse } from "next/server";
import { workoutService } from "@/server/services/workout-service";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const userWorkouts = await workoutService.getUserWorkouts(Number(userId));
  return NextResponse.json(userWorkouts);
}
