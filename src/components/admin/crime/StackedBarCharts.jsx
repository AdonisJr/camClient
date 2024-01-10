import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StackedBarCharts({casePerYear}) {
  return (
    <ResponsiveContainer width="100%" height={400}>
    <BarChart data={casePerYear} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" tick={{ fontSize: 14 }} label={{ value: 'Year', position: 'insideBottom', fontSize: 16 }} />
      <YAxis />
      <Tooltip />
      <Legend />
      
      <Bar dataKey="under_investigation" stackId="cases" fill="#8884d8" />
      <Bar dataKey="cleared" stackId="cases" fill="#82ca9d" />
      <Bar dataKey="solved" stackId="cases" fill="#ffc658" />
    </BarChart>
  </ResponsiveContainer>
  )
}
