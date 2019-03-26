import React, { PureComponent } from 'react';
import {
  PieChart, 
  Pie, 
  ResponsiveContainer,
  Legend,
  Tooltip,
  Cell
} from 'recharts';

const COLORS = ['#9575cd', '#7986cb', '#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac'];

export default class CustomPieChart extends PureComponent {

  render() {
    const { data, dataKey, dataTitle } = this.props;

    return (
        <ResponsiveContainer width="99%" height="100%" minHeight={255}>
            <PieChart>
                <text 
                    x="50%" 
                    y="100%"
                    textAnchor="middle" 
                    dominantBaseline="alphabetic"
                    style={{fontWeight: 'bold'}}>
                    {dataTitle}
                </text>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle"/>
                <Pie data={data} dataKey={dataKey} outerRadius="75%" fill="#8884d8">
                    {
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                </ Pie>

            </PieChart>
        </ResponsiveContainer>
    );
  }
}
