import { ChangeEventHandler, useState, useRef, useEffect } from 'react'
import * as Plot from '@observablehq/plot';
import type { ExerciseHistory } from './models/exercise';
import { useDependency } from './dependency';

import './App.css'
import { useOptions } from './hooks';
import MetricOptions from './components/MetricOptions';

function App() {
  const { parseStrongCSV } = useDependency();
  const [ selectedExercise, setSelectedExercise ] = useState('');
  const [ history, setHistory ] = useState<ExerciseHistory>({
    exerciseNames: [],
    exercises: {}
  });

  const weightOptions = useOptions(true);
  const repsOptions = useOptions(false);
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

    const marks = [];
    if (repsOptions.showMetric) {
      marks.push(
        repsOptions.showRange ? Plot.ruleX(logs, Plot.groupX({ y1: 'min', y2: 'max' }, { x: 'date', y: 'reps', stroke: '#f99' })) : undefined,
        repsOptions.showAgg ? Plot.line(logs, Plot.groupX({ y: repsOptions.agg }, { x: 'date', y: 'reps', stroke: 'red' })) : undefined,
        repsOptions.showSets ? Plot.dot(logs, { x: 'date', y: 'reps', stroke: '#a00', strokeOpacity: 0.5 }) : undefined,
      )
    }
    if (weightOptions.showMetric) {
      marks.push(
        weightOptions.showRange ? Plot.ruleX(logs, Plot.groupX({ y1: 'min', y2: 'max' }, { x: 'date', y: 'weight', stroke: '#99f' })) : undefined,
        weightOptions.showAgg ? Plot.line(logs, Plot.groupX({ y: weightOptions.agg }, { x: 'date', y: 'weight', stroke: 'blue' })) : undefined,
        weightOptions.showSets ? Plot.dot(logs, { x: 'date', y: 'weight', stroke: '#00a', strokeOpacity: 0.5 }) : undefined,
      )
    }

    const plotSvg = Plot.plot({ marks });
    chartRef.current?.replaceChildren(plotSvg)
  }, [selectedExercise, history, weightOptions, repsOptions]);

  return (
    <div className="App">
      <h1>Strong Charts</h1>
      <div className="card">
        <p>
          Select the CSV file that's <a href="https://help.strongapp.io/article/235-export-workout-data">exported from the Strong app</a>
        </p>
        <div className="inputs-container">
          <div className="exercise-select">
            <input type="file" id="input" onChange={handleFile} />
            <select
              value={selectedExercise}
              onChange={e => setSelectedExercise(e.target.value)}
              disabled={history.exerciseNames.length === 0}
            >
              {history.exerciseNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="options-container">
            <MetricOptions
              metric="reps"
              options={repsOptions}
              handleCheckbox={repsOptions.handleCheckbox}
              setAgg={repsOptions.setAgg}
            />
            <MetricOptions
              metric="weight"
              options={weightOptions}
              handleCheckbox={weightOptions.handleCheckbox}
              setAgg={weightOptions.setAgg}
            />
          </div>
        </div>
        <div className="chart-container" ref={chartRef}></div>
      </div>
    </div>
  )
}

export default App
