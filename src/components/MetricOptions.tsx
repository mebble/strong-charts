import type { ExerciseMetric } from "../models/exercise";
import type { Aggregator, AggregatorHandler, CheckboxHandler } from "../models/plot";

const MetricOptions = ({
    metric,
    options: {
        showMetric = false,
        showSets = true,
        showRange = true,
        showAgg = true,
        agg = 'mean',
    },
    handleCheckbox,
    setAgg,
}: {
    metric: ExerciseMetric,
    options: {
        showMetric?: boolean,
        showSets?: boolean,
        showRange?: boolean,
        showAgg?: boolean,
        agg?: Aggregator,
    },
    handleCheckbox: CheckboxHandler,
    setAgg: AggregatorHandler,
}) => {
    return <form>
        <div>
            <label htmlFor={`${metric}show-metric`}>Show {metric}</label>
            <input id={`${metric}-show-metric`} name="show-metric" type="checkbox" checked={showMetric} onChange={e => handleCheckbox('metric', e.target.checked)} />
        </div>
        <fieldset disabled={!showMetric}>
          <div>
            <label htmlFor={`${metric}show-sets`}>Sets</label>
            <input id={`${metric}-show-sets`} name="show-sets" type="checkbox" checked={showSets} onChange={e => handleCheckbox('sets', e.target.checked)} />
          </div>
          <div>
            <label htmlFor={`${metric}-show-range`}>Range</label>
            <input id={`${metric}-show-range`} name="show-range" type="checkbox" checked={showRange} onChange={e => handleCheckbox('range', e.target.checked)} />
          </div>
          <div>
            <label htmlFor={`${metric}-show-agg`}>Aggregate</label>
            <input id={`${metric}-show-agg`} name="show-agg" type="checkbox" checked={showAgg} onChange={e => handleCheckbox('agg', e.target.checked)} />
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
        </fieldset>
    </form>
};

export default MetricOptions;
