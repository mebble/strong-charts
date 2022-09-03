import { ChangeEventHandler, useState, useRef, useEffect } from 'react'
import * as Plot from '@observablehq/plot';
import type { ExerciseHistory, ExerciseMetric } from './models';
import { useDependency } from './dependency';

import './App.css'

function App() {
  const { parseStrongCSV } = useDependency();
  const [ selectedExercise, setSelectedExercise ] = useState('');
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
    const plotSvg = Plot.plot({
      marks: [
          Plot.dot(logs, { x: 'date', y: metric })
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
