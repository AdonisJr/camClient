import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';

const BarChartNew = ({ crimes }) => {
    const formattedData = useMemo(() => {
        const counts = {};

        if (crimes) {
            // Iterate over the crimes array
            crimes.forEach(crime => {
                const { barangay, type, offense } = crime;

                // Initialize counts object for the barangay if not already exists
                counts[barangay] = counts[barangay] || { total_cases: 0, offenses: {} };

                // If the crime type is index, increment the total_cases count for the barangay
                if (type === 'index') {
                    counts[barangay].total_cases++;

                    // Increment the count for the offense type
                    counts[barangay].offenses[offense] = (counts[barangay].offenses[offense] || 0) + 1;
                }
            });
        }

        // Convert counts object to the desired format
        const result = Object.entries(counts).map(([barangay, { total_cases, offenses }]) => ({
            barangay,
            total_cases,
            offenses: Object.entries(offenses).map(([offense, count]) => ({ offense, count }))
        }));
        console.log(result)
        return result;
    }, [crimes]);

    return (
        <BarChart width={900} height={350} data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} className='text-xs'>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="barangay" tick={{ fontSize: 14 }} label={{ value: '', position: 'insideBottom', fontSize: 16 }} angle={-15} textAnchor="end" interval={0} />
            <YAxis dataKey="total_cases" domain={[0, 500]} />
            <Tooltip content={<CustomTooltip payload={formattedData} className='overflow-auto' />} className='overflow-auto' />
            {/* <Legend /> */}
            <Bar dataKey="total_cases" fill="#dc143c" />
        </BarChart>
    );
};

export default BarChartNew;
