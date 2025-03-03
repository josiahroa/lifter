// Required import for standalone script
import "dotenv/config";

import db from "./index";
import {
  lifts,
  liftVariations,
  attachments,
  workouts,
  workoutLifts,
} from "./schema";

async function seed() {
  console.log("Clearing old seed data");
  await clearData();

  console.log("Adding new seed data");

  // Insert basic lifts
  const liftData = [
    { name: "Pull Down" },
    { name: "Curl" },
    { name: "Fly" },
    { name: "Row" },
    { name: "Press" },
    { name: "Extension" },
    { name: "Raise" },
    { name: "Deadlift" },
    { name: "Squat" },
    { name: "Thrust" },
  ];

  const insertedLifts = await db.insert(lifts).values(liftData);

  // Insert lift variations
  const variationData = [
    {
      liftId: 1,
      variationName: "Machine",
      variationDescription: "",
    },
    {
      liftId: 1,
      variationName: "Cable",
      variationDescription: "",
    },
    {
      liftId: 2,
      variationName: "Dumbbell",
      variationDescription: "",
    },
    {
      liftId: 2,
      variationName: "Barbell",
      variationDescription: "",
    },
  ];

  const insertedVariations = await db
    .insert(liftVariations)
    .values(variationData);

  const attachmentData = [
    {
      id: 1,
      name: "Tricep Rope",
    },
  ];

  const insertedAttachments = await db
    .insert(attachments)
    .values(attachmentData);

  const workoutData = [
    {
      userId: 1,
      workoutDate: new Date("2025-01-10"),
      workoutName: "Leg Day",
    },
  ];

  const insertedWorkouts = await db.insert(workouts).values(workoutData);

  const workoutLiftData = [
    {
      id: 1,
      workoutId: 1,
      liftVariationId: 1,
    },
  ];

  const insertedWorkoutLifts = await db
    .insert(workoutLifts)
    .values(workoutLiftData);

  //   console.log("Inserted lifts", insertedLifts);
}

async function clearData() {
  try {
    // Delete in reverse order of dependencies
    console.log("Deleting lifts");
    await db.delete(lifts);
  } catch (error) {
    console.error("Error clearing seed data", error);
  }
  console.log("Cleared seed data");
  return;
}

function main() {
  const command = process.argv[2];
  // tsx -r dotenv/config src/db/seed.ts seed
  if (command === "seed") {
    console.log("Seeding data");
    seed();
  }
  // tsx -r dotenv/config src/db/seed.ts clear
  if (command === "clear") {
    console.log("Clearing data");
    clearData();
  }
}

main();
