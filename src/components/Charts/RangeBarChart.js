import React from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend,
    ResponsiveContainer 
} from 'recharts';
import { withTheme } from '@material-ui/core/styles';

const RangeBarChart = (props) => {
    const { theme, data, xAxisDataKey, yAxisDataKey, maxRange } = props;
    return (
        <ResponsiveContainer width="99%" height="100%" minHeight={255}>
            <BarChart data={data} margin={{top: 24, right: 24}}>
                <XAxis dataKey={xAxisDataKey} />
                <YAxis type="number" domain={[0, maxRange]}/>
                <Tooltip />
                <Legend />
                <Bar dataKey={yAxisDataKey} fill={theme.palette.primary.main} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default withTheme()(RangeBarChart);