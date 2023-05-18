import { ChangeEventHandler, useState } from 'react'
import type { ExerciseHistory } from './models/exercise';
import { useDependency } from './dependency';

import './App.css'
import Chart from './components/Chart';

function App() {
  const { parseStrongCSV } = useDependency();
  const [ selectedExercise, setSelectedExercise ] = useState('');
  const [ history, setHistory ] = useState<ExerciseHistory>({
    exerciseNames: [],
    exercises: {}
  });

  const handleFile: ChangeEventHandler = (e) => {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files[0];

    parseStrongCSV(file)
      .then(history => {
        setHistory(history)
        setSelectedExercise(Object.keys(history.exercises)[0])
      });
  };

  return (
    <div className="App">
      <h1>Strong Charts</h1>
      <div className="card">
        <p>
          Select the CSV file that's <a href="https://help.strongapp.io/article/235-export-workout-data">exported from the Strong app</a>
        </p>
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
        <div className="charts">
          <Chart selectedExercise={selectedExercise} history={history} metric="weight" />
          <Chart selectedExercise={selectedExercise} history={history} metric="reps" />
        </div>
      </div>
    </div>
  )
}

export default App
