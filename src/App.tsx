import { ChangeEventHandler, useState, useRef } from 'react'
import { parse } from 'papaparse';
import * as Plot from '@observablehq/plot';
import reactLogo from './assets/react.svg'
import './App.css'

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

function App() {
  const [count, setCount] = useState(0)
  const chartRef = useRef<HTMLDivElement>(null);

  const handleFile: ChangeEventHandler = (e) => {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files[0];
    if (file.type !== 'text/csv') {
      console.error('Not a CSV file')
      return;
    };
    parse<StrongLineItem>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete(results) {
        console.log(results)
        const plotSvg = Plot.plot({
          marks: [
            Plot.dot(results.data, { x: 'Date', y: 'Weight' })
          ]
        })
        chartRef.current?.append(plotSvg)
      },
    })
  };

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
        <div className="chart-container" ref={chartRef}></div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
