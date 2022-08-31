import { ChangeEventHandler, useState, useRef, useEffect } from 'react'
import * as Plot from '@observablehq/plot';
import type { ExerciseHistory } from './models';
import { useDependency } from './dependency';
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [ selectedExercise, setSelectedExercise ] = useState('');
  const [ history, setHistory ] = useState<ExerciseHistory>({
    exerciseNames: [],
    exercises: {}
  });
  const [count, setCount] = useState(0)
  const chartRef = useRef<HTMLDivElement>(null);
  const { parseStrongCSV } = useDependency();

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
          Plot.dot(logs, { x: 'date', y: 'reps' })
      ]
    })
    chartRef.current?.replaceChildren(plotSvg)
  }, [selectedExercise]);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
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
        <div className="chart-container" ref={chartRef}></div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
