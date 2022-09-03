import { useState } from "react";
import type { Aggregator, MetricOptions} from "./models/plot";

export const useOptions = (show: boolean): MetricOptions => {
    const [ showMetric, setShowMetric ] = useState(show);
    const [ showSets, setShowSets ] = useState(true);
    const [ showRange, setShowRange ] = useState(true);
    const [ showAgg, setShowAgg ] = useState(true);
    const [ agg, setAgg ] = useState<Aggregator>('mean');

    return {
        showMetric,
        showSets,
        showRange,
        showAgg,
        agg,
        setAgg,
        handleCheckbox(box, value) {
            switch (box) {
                case 'metric':
                    setShowMetric(value);
                    break;
                case 'sets':
                    setShowSets(value);
                    break;
                case 'range':
                    setShowRange(value);
                    break;
                case 'agg':
                    setShowAgg(value);
                    break;
                default:
                    break;
            }
        },
    }
};
