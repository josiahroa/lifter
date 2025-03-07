"use client";

import { useState, useEffect } from "react";
import { Workout } from "@lifter/db";
export default function Dashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Retrieve workouts for the current user
  useEffect(() => {
    async function fetchWorkouts() {
      console.log("Fetching workouts");
      const res = await fetch("/api/workouts/1");
      console.log("Response", res);
      const data = await res.json();
      console.log("Data", data);
      setWorkouts(data);
    }
    fetchWorkouts();
  }, []);

  return (
    <div>
      {workouts.map((workout) => (
        <div key={workout.workoutName}>{workout.workoutName}</div>
      ))}
    </div>
  );
}
