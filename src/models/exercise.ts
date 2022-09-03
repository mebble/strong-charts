export type ExerciseLog = {
    date: Date,
    setOrder: number,
    weight: number,
    reps: number,
    rpe: number | null,
};

export type ExerciseMetric = 'weight' | 'reps' | 'rpe';

export type ExerciseMap = {
    [key: string]: ExerciseLog[]
};

export type ExerciseHistory = {
    exerciseNames: string[]
    exercises: ExerciseMap
};
