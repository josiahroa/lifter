import { column, Schema, Table } from "@powersync/react-native";

const users = new Table(
  {
    // id column (text) is automatically included
    name: column.text,
    email: column.text,
    created_at: column.text,
    updated_at: column.text,
    deleted_at: column.text,
  },
  { indexes: {} }
);

const exercises = new Table(
  {
    // id column (text) is automatically included
    user_id: column.text,
    name: column.text,
    muscle_group: column.text,
    muscle_group_target: column.text,
    equipment: column.text,
    equipment_description: column.text,
    created_at: column.text,
    updated_at: column.text,
    deleted_at: column.text,
  },
  { indexes: {} }
);

const workouts = new Table(
  {
    // id column (text) is automatically included
    user_id: column.text,
    name: column.text,
    created_at: column.text,
    updated_at: column.text,
    deleted_at: column.text,
  },
  { indexes: {} }
);

const workout_exercises = new Table(
  {
    // id column (text) is automatically included
    workout_id: column.integer,
    exercise_id: column.integer,
    created_at: column.text,
    updated_at: column.text,
    deleted_at: column.text,
  },
  { indexes: {} }
);

const workout_logs = new Table(
  {
    // id column (text) is automatically included
    user_id: column.text,
    workout_date: column.text,
    created_at: column.text,
    updated_at: column.text,
    deleted_at: column.text,
  },
  { indexes: {} }
);

const exercise_logs = new Table(
  {
    // id column (text) is automatically included
    workout_log_id: column.integer,
    exercise_id: column.integer,
    created_at: column.text,
    updated_at: column.text,
    deleted_at: column.text,
  },
  { indexes: {} }
);

const exercise_set_logs = new Table(
  {
    // id column (text) is automatically included
    exercise_log_id: column.integer,
    set_number: column.integer,
    reps: column.integer,
    weight: column.text,
    created_at: column.text,
    updated_at: column.text,
    deleted_at: column.text,
    workout_log_id: column.integer,
  },
  { indexes: {} }
);

export const AppSchema = new Schema({
  users,
  exercises,
  workouts,
  workout_exercises,
  workout_logs,
  exercise_logs,
  exercise_set_logs,
});

export type Database = (typeof AppSchema)["types"];
