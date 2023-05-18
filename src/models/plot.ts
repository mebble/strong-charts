export type Checkbox = 'sets' | 'range' | 'agg';
export type Aggregator = 'sum' | 'min' | 'max' | 'mean' | 'median' | 'mode';

export type CheckboxHandler = (box: Checkbox, value: boolean) => void;
export type AggregatorHandler = (agg: Aggregator) => void;

export type MetricOptions = {
    showSets: boolean,
    showRange: boolean,
    showAgg: boolean,
    agg: Aggregator,
    handleCheckbox: CheckboxHandler,
    setAgg: AggregatorHandler,
}
