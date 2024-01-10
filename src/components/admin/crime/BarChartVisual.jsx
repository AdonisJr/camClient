import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export default function BarChartVisual({totalCasesPerBrgy}) {
    return (
        <BarChart width={800} height={350} data={totalCasesPerBrgy} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="barangay" tick={{ fontSize: 14 }} label={{ value: '', position: 'insideBottom', fontSize: 16 }} angle={-15} textAnchor="end" interval={0} />
            <YAxis dataKey={"total_cases"} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_cases" fill="#bf9b30" />
        </BarChart>
    )
}
