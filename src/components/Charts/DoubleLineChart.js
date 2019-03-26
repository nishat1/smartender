import React from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend,
    ResponsiveContainer 
} from 'recharts';
import { withTheme } from '@material-ui/core/styles';

const DoubleLineChart = (props) => {
    const { theme, data, yAxisDataKeyA, yAxisDataKeyB, xAxisDataKey } = props;
    return (
        <ResponsiveContainer width="99%" height="100%" minHeight={255}>
            <AreaChart data={data} margin={{top: 24, right: 24}}>
                <defs>
                    <linearGradient id="colorDrinks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey={xAxisDataKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area dataKey={yAxisDataKeyA} type="monotone" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorDrinks)" />
                <Area dataKey={yAxisDataKeyB} type="monotone" stroke={theme.palette.secondary.main} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default withTheme()(DoubleLineChart);