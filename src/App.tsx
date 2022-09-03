import { ChangeEventHandler, useState, useRef, useEffect } from 'react'
import * as Plot from '@observablehq/plot';
import type { ExerciseHistory, ExerciseMetric } from './models';
import { useDependency } from './dependency';

import './App.css'

type Aggregator = 'sum' | 'min' | 'max' | 'mean' | 'median' | 'mode';

function App() {
  const { parseStrongCSV } = useDependency();
  const [ selectedExercise, setSelectedExercise ] = useState('');
  const [ agg, setAgg ] = useState<Aggregator>('mean');
  const [ showSets, setShowSets ] = useState(true);
  const [ showRange, setShowRange ] = useState(true);
  const [ showAgg, setShowAgg ] = useState(true);
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

    const marks = [
      showRange ? Plot.ruleX(logs, Plot.groupX({ y1: 'min', y2: 'max' }, { x: 'date', y: metric })) : undefined,
      showAgg ? Plot.line(logs, Plot.groupX({ y: agg }, { x: 'date', y: metric })) : undefined,
      showSets ? Plot.dot(logs, { x: 'date', y: metric }) : undefined,
    ];

    const plotSvg = Plot.plot({ marks });
    chartRef.current?.replaceChildren(plotSvg)
  }, [selectedExercise, metric, agg, showSets, showRange, showAgg]);

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
          <div>
            <label htmlFor="show-sets">Sets</label>
            <input id="show-sets" name="show-sets" type="checkbox" checked={showSets} onChange={e => setShowSets(e.target.checked)} />
          </div>
          <div>
            <label htmlFor="show-range">Range</label>
            <input id="show-range" name="show-range" type="checkbox" checked={showRange} onChange={e => setShowRange(e.target.checked)} />
          </div>
          <div>
            <label htmlFor="show-agg">Aggregate</label>
            <input id="show-agg" name="show-agg" type="checkbox" checked={showAgg} onChange={e => setShowAgg(e.target.checked)} />
          </div>
          <select
            value={agg}
            onChange={e => setAgg(e.target.value as Aggregator)}
          >
            <option value="sum">sum</option>
            <option value="min">min</option>
            <option value="max">max</option>
            <option value="mean">mean</option>
            <option value="median">median</option>
            <option value="mode">mode</option>
          </select>
        </div>
        <div className="chart-container" ref={chartRef}></div>
      </div>
    </div>
  )
}

export default App
