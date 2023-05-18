// https://observablehq.com/plot/getting-started#plot-in-react

import { ruleX, line, dot, groupX, plot } from '@observablehq/plot'
import { ExerciseHistory, ExerciseMetric } from "../models/exercise";
import { useOptions } from '../hooks';
import MetricOptions from './MetricOptions';
import { useEffect, useRef } from 'react';

type ChartProps = {
    history: ExerciseHistory,
    selectedExercise: string,
    metric: ExerciseMetric,
};

const Chart = ({ history, selectedExercise, metric }: ChartProps) => {
    const options = useOptions();
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const logs = history.exercises[selectedExercise];
        if (logs === undefined) return;

        const marks = [];
        if (options.showRange) marks.push(ruleX(logs, groupX({ y1: 'min', y2: 'max' }, { x: 'date', y: metric, stroke: '#f99' })))
        if (options.showAgg) marks.push(line(logs, groupX({ y: options.agg }, { x: 'date', y: metric, stroke: 'red' })))
        if (options.showSets) marks.push(dot(logs, { x: 'date', y: metric, stroke: '#a00', strokeOpacity: 0.5 }))

        const plotSvg = plot({ marks });
        chartRef.current?.append(plotSvg)

        return () => plotSvg.remove()
    }, [selectedExercise, history, options]);

    return <div>
        <div className="options-container">
            <MetricOptions
                metric={metric}
                options={options}
                handleCheckbox={options.handleCheckbox}
                setAgg={options.setAgg}
            />
        </div>
        <div ref={chartRef}></div>
    </div>
};

export default Chart;
