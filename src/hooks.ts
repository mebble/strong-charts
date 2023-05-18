import { useState } from "react";
import type { Aggregator, MetricOptions} from "./models/plot";

export const useOptions = (): MetricOptions => {
    const [ showSets, setShowSets ] = useState(true);
    const [ showRange, setShowRange ] = useState(true);
    const [ showAgg, setShowAgg ] = useState(true);
    const [ agg, setAgg ] = useState<Aggregator>('mean');

    return {
        showSets,
        showRange,
        showAgg,
        agg,
        setAgg,
        handleCheckbox(box, value) {
            switch (box) {
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
                    const _exhaustive: never = box;
            }
        },
    }
};
