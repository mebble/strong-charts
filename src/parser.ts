import { parse } from 'papaparse';
import type { ExerciseLog, ExerciseHistory, ExerciseMap } from './models';

type StrongLineItem = {
    Date: string,
    Distance: number,
    Duration: string,
    'Exercise Name': string,
    Notes: string | null,
    RPE: number | null,
    Reps: number,
    Seconds: number,
    'Set Order': number,
    Weight: number,
    'Workout Name': string,
    'Workout Notes': string | null,
};

type FileParser = (parser: typeof parse) => (file: File) => Promise<ExerciseHistory>;

const mapItem = (item: StrongLineItem): ExerciseLog => {
    return {
        date: new Date(item.Date),
        setOrder: item['Set Order'],
        weight: item.Weight,
        reps: item.Reps,
        rpe: item.RPE,
    }
}

export const csvParser: FileParser = parse => csvFile => {
    return new Promise((resolve, reject) => {
        if (csvFile.type !== 'text/csv') {
            reject(new Error('Not a CSV file'));
            return;
        };

        parse<StrongLineItem>(csvFile, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete(results) {
                if (results.errors.length) {
                    reject(results.errors[0]);
                    return;
                }

                const exercises = results.data.reduce<ExerciseMap>((map, item) => {
                    const log = mapItem(item);
                    const exerciseName = item['Exercise Name'];
                    if (exerciseName in map) {
                        map[exerciseName].push(log);
                        return map;
                    }
                    return { ...map, [exerciseName]: [log] };
                }, {});

                resolve({
                    exerciseNames: Object.keys(exercises),
                    exercises
                });
            },
        })
    });
};
