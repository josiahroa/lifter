export default function Dashboard() {
  const workouts = [
    {
      splitName: "Legs",
      date: "2025-02-05",
      exercises: [
        { name: "Squats", sets: 3, reps: 10 },
        { name: "Deadlifts", sets: 3, reps: 10 },
      ],
    },
    {
      splitName: "Back",
      date: "2025-02-05",
      exercises: [{ name: "Deadlifts", sets: 3, reps: 10 }],
    },
    {
      splitName: "Chest",
      date: "2025-02-05",
      exercises: [{ name: "Deadlifts", sets: 3, reps: 10 }],
    },
  ];

  return (
    <div>
      {workouts.map((workout) => (
        <div key={workout.splitName}>{workout.splitName}</div>
      ))}
    </div>
  );
}
