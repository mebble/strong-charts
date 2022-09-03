import { ChangeEventHandler, useState, useRef, useEffect } from 'react'
import * as Plot from '@observablehq/plot';
import type { ExerciseHistory, ExerciseLog, ExerciseMetric } from './models';
import { useDependency } from './dependency';

import './App.css'

type MetricReducer = (metric1: number, metric2: number) => number;
const sum: MetricReducer = (num1, num2) => num1 + num2;

function App() {
  const { parseStrongCSV } = useDependency();
  const [ selectedExercise, setSelectedExercise ] = useState('');
  const [ logReducer, setLogReducer ] = useState<MetricReducer>(() => sum);  // https://stackoverflow.com/a/55621679
  const [ metric, setMetric ] = useState<ExerciseMetric>('reps');
  const [ history, setHistory ] = useState<ExerciseHistory>({
    exerciseNames: [],
    exercises: {}
  });
  const chartRef = useRef<HTMLDivElement>(null);

  const handleFile: ChangeEventHandler = (e) => {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files[0];

    parseStrongCSV(file)
      .then(history => setHistory(history));
  };

  useEffect(() => {
    const logs = history.exercises[selectedExercise];
    if (logs === undefined) return;

    const aggregatedLogs = Object.entries(
        logs.reduce<{ [dateString: string]: ExerciseLog }>((agg, log) => {
          const dateString = log.date.toString()
          if (dateString in agg) {
            const logAgg = agg[dateString];
            agg[dateString] = {
              date: logAgg.date,
              setOrder: 0,
              weight: logReducer(logAgg.weight, log.weight),
              reps: logReducer(logAgg.reps, log.reps),
              rpe: logReducer((logAgg.rpe || 0), (log.rpe || 0)),
            };
            return agg
          }
          return { ...agg, [dateString]: log }
        }, {})
      ).map(entry => entry[1])

    const plotSvg = Plot.plot({
      marks: [
          Plot.dot(aggregatedLogs, { x: 'date', y: metric })
      ]
    })
    chartRef.current?.replaceChildren(plotSvg)
  }, [selectedExercise, metric]);

  return (
    <div className="App">
      <h1>Strong Charts</h1>
      <div className="card">
        <p>
          Select the CSV file exported from the Strong app
        </p>
        <input type="file" id="input" onChange={handleFile} />
        <div className="options-container">
          <select
            value={selectedExercise}
            onChange={e => setSelectedExercise(e.target.value)}
            disabled={history.exerciseNames.length === 0}
          >
            {history.exerciseNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <select
            value={metric}
            onChange={e => setMetric(e.target.value as ExerciseMetric)}
          >
            <option value="reps">Reps</option>
            <option value="weight">Weight</option>
            <option value="rpe">RPE</option>
          </select>
        </div>
        <div className="chart-container" ref={chartRef}></div>
      </div>
    </div>
  )
}

export default App
