import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function LineChartVisual({ totalCasesPerYear }) {
    return (
        <LineChart width={750} height={300} className='w-full h-full' data={totalCasesPerYear}>
            <XAxis dataKey="extracted_year" />
            <YAxis dataKey={"total_cases"} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_cases" stroke="#bf9b30" strokeWidth={4} />
        </LineChart>
    )
}
