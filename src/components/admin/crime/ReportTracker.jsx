import React, { useState, useEffect, useMemo } from "react";
import CrimeTable from "./CrimeTable";
import GoogleMapEmb from "./GoogleMap";
import axios from "axios";
import LineChart from "./LineChartVisual";
import { BarChart } from "recharts";
import BarChartVisual from "./BarChartVisual";
import StackedBarCharts from "./StackedBarCharts";
import CustomTooltip from "./CustomTooltip3";
import DataPerBarangay from "./DataPerBarangay";
import BarChartNew from "./BarchartNew";
import BarChartNonIndex from "./BarChartNonIndex";

export default function ReportTracker({ crimes, totalCasesPerBrgy, totalCasesPerYear, caseStatus, casePerYear, showTooltip, setTooltip }) {
  const [currentLocation, setCurrentLocation] = useState();
  const googleApi = process.env.REACT_APP_GOOGLE_API_KEY;
  const [selected, setSelected] = useState([]);
  const [updatedData, setUpdatedData] = useState(null);
  const [countPerBarangay, setCountPerBarangay] = useState([]);

  const counts = useMemo(() => {
    const counts = {};
    if (updatedData) {
      // Compute counts for each barangay
      updatedData.forEach(crime => {
        const { barangay, type } = crime;
        counts[barangay] = counts[barangay] || { index: 0, nonIndex: 0 };
        if (type === 'index') {
          counts[barangay].index++;
        } else if (type === 'non-index') {
          counts[barangay].nonIndex++;
        }
      });
    }
    return counts;
  }, [updatedData]);

  // Memoized calculation of updated data list
  const memoizedUpdatedDataList = useMemo(() => {
    if (crimes) {
      return crimes.map(dataItem => {
        // Check if offense contains any of the specified keywords
        const keywords = ['murder', 'homicide', 'physical injury', 'rape', 'robbery', 'theft', 'carnapping'];
        const isIndexed = keywords.some(keyword => dataItem.offense.toLowerCase().includes(keyword));

        // Create new object with updated data
        return { ...dataItem, type: isIndexed ? 'index' : 'non-index' };
      });
    }

  }, [crimes]);

  const barangayOffenseCounts = useMemo(() => {
    const counts = {};
    
    if (updatedData) {
      // Iterate over the updatedData array
      updatedData.forEach(crime => {
        const { barangay, type, offense } = crime;
        
        // Initialize counts object for the barangay if not already exists
        counts[barangay] = counts[barangay] || {};
        
        // Initialize counts object for the offense type if not already exists
        counts[barangay][type] = counts[barangay][type] || {};
        
        // Increment the count for the offense type
        counts[barangay][type][offense] = (counts[barangay][type][offense] || 0) + 1;
      });
    }
    
    // Convert counts object to the desired format
    const result = Object.entries(counts).map(([barangay, offenses]) => ({
      barangay,
      ...Object.entries(offenses).map(([type, offenseCounts]) => ({
        type,
        offenses: Object.entries(offenseCounts).map(([offense, count]) => ({ offense, count }))
      }))
    }));
    
    return result;
  }, [updatedData]);

  useEffect(() => {
    setCountPerBarangay(counts)
    console.log(barangayOffenseCounts)
  }, [updatedData])

  useEffect(() => {
    setUpdatedData(memoizedUpdatedDataList);
  }, [memoizedUpdatedDataList]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Get the user's current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position.coords)
        },
        (err) => {
          console.log(err)
        }
      );
    } else {
      console.log("Geolocation is not available in your browser.")
    }
  }, [])




  return (
    <div className="flex flex-col w-full h-full gap-3 p-2 sm:p-5 rounded-smoverflow-auto">

      {/* <>
        <p>CRIMES</p>
        <div>
          <CrimeTable
            crimes={crimes}
            handleSelectedCrime={handleSelectedCrime}
            handleSubmit={handleSubmit}
          />
        </div>
      </> */}
      <div className="flex gap-5">
        {/* per brgy */}
        <div className="w-4/12 max-h-56 z-50 bg-white shadow-md rounded-md p-3 overflow-y-scroll">
          <div className="text-center w-full">
            <DataPerBarangay totalCasesPerBrgy={totalCasesPerBrgy} />
          </div>

        </div>
        {/* per year */}
        <div className="w-4/12 max-h-56 bg-white shadow-md rounded-md p-3 overflow-y-scroll">
          <div className="text-center w-full">
            <p className="text-start p-2 font-bold text-slate-500">Total Cases Per Year</p>
            <hr></hr>
            {
              !totalCasesPerYear ? <></> :
                totalCasesPerYear.map((count) => (
                  <p className="font-serif text-lg m-2">{count.extracted_year} : <span className="text-2xl font-bold">{count.total_cases}</span></p>
                ))
            }
          </div>
        </div>
        {/* Case Status */}
        <div className="w-4/12 max-h-56 bg-white shadow-md rounded-md p-3 overflow-y-scroll">
          <div className="text-center w-full">
            <p className="text-start p-2 font-bold text-slate-500">Over All Case Status</p>
            <hr></hr>
            <div className="flex flex-col w-full h-full justify-center">
              {
                !caseStatus ? <></> :
                  caseStatus.map((count) => (
                    <p className="font-serif text-lg m-2">{count.case_status} : <span className="text-2xl font-bold">{count.total}</span></p>
                  ))
              }
            </div>

          </div>
        </div>
      </div>

      {/* charts */}

      <div className='flex flex-col w-full bg-white rounded-md shadow-md p-2'>
        <p className='text-start p-2 font-bold text-slate-500'>Visualizing Total Cases Across Barangays (Index Crimes)</p>
        {
          !updatedData ? '' :
        <BarChartNew crimes={updatedData}  />
        }
      </div>
      <div className='flex flex-col w-full bg-white rounded-md shadow-md p-2'>
        <p className='text-start p-2 font-bold text-slate-500'>Visualizing Total Cases Across Barangays (Non-Index Crimes)</p>
        {
          !updatedData ? '' :
        <BarChartNonIndex crimes={updatedData}  />
        }
      </div>
{/* 
      <div className='flex flex-col w-full bg-white rounded-md shadow-md p-2'>
        <p className='text-start p-2 font-bold text-slate-500'>Visualizing Total Cases Across Barangays (Index Crimes)</p>
        <BarChartVisual totalCasesPerBrgy={totalCasesPerBrgy} showTooltip={showTooltip} setTooltip={setTooltip} selected={selected} setSelected={setSelected} />
      </div> */}

      <div className="w-full">
        {/* LINE */}
        <div className='flex gap-5 w-full'>
          <div className='flex flex-col w-full bg-white rounded-md shadow-md p-2'>
            <p className='text-start p-2 font-bold text-slate-500'>Visualizing Trends: Total Cases Over Different Dates</p>
            <LineChart crimes={crimes} totalCasesPerBrgy={totalCasesPerBrgy} totalCasesPerYear={totalCasesPerYear} caseStatus={caseStatus} />
          </div>

        </div>
      </div>
      <div className='flex flex-col w-full bg-white rounded-md shadow-md p-2'>
        <p className='text-start p-2 font-bold text-slate-500'>Yearly Distribution of Cases</p>
        <StackedBarCharts casePerYear={casePerYear} />
      </div>
      {/* GOOGLE MAP */}
      {/* <div className=" bg-white ">
        {
          currentLocation ?


            <GoogleMapEmb currentLocation={currentLocation} apiKey={googleApi} crimes={crimes} />
            : 'Loading'
        }
      </div> */}
    </div>
  );
}
{/* <GoogleMapEmbed apiKey={googleApi} selectedCrime={selectedCrime} crimes={crimes} zoom={19} currentLocation={currentLocation} /> */ }