# Schema

This document exists to provide context for the schema.

### Workout

Unique to a user.

A workout is a group of exercises.

One workout can have many exercises.

### Exercise

Unique to a user.

An exercise is a muscle group, muscle group target, and method to performing the exercise.

An exercise can belong to many workouts.

### Workout Log

Unique to a user.

A workout log is a user's daily workout, consisting of the exercises that were performed that day.

A workout log can have many exercise logs.

### Exercise Log

Unique to a user.

An exercise log is a group of sets and reps performed on a muscle group, muscle group target, with a specified method on a specific day.

An exercise log can belong to only one workout log.
An exercise log can have many exercise set logs.

### Exercise Set Log

An exercise set log is a single set (reps and weight) for a specific exercise log.

An exercise set log can belong to only one exercise log.
