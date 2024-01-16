import React, { useState, useEffect } from "react";
import CrimeTable from "./CrimeTable";
import GoogleMapEmb from "./GoogleMap";
import axios from "axios";
import LineChart from "./LineChartVisual";
import { BarChart } from "recharts";
import BarChartVisual from "./BarChartVisual";
import StackedBarCharts from "./StackedBarCharts";
import CustomTooltip from "./CustomTooltip3";
import DataPerBarangay from "./DataPerBarangay";

export default function ReportTracker({ crimes, totalCasesPerBrgy, totalCasesPerYear, caseStatus, casePerYear, showTooltip, setTooltip }) {
  const [currentLocation, setCurrentLocation] = useState();
  const googleApi = process.env.REACT_APP_GOOGLE_API_KEY;
  const [selected, setSelected] = useState([]);


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
        <p className='text-start p-2 font-bold text-slate-500'>Visualizing Total Cases Across Barangays</p>
        <BarChartVisual totalCasesPerBrgy={totalCasesPerBrgy} showTooltip={showTooltip} setTooltip={setTooltip} selected={selected} setSelected={setSelected} />
      </div>
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

      <div className=" bg-white ">
        {
          currentLocation ?


            <GoogleMapEmb currentLocation={currentLocation} apiKey={googleApi} crimes={crimes} />
            : 'Loading'
        }
      </div>
    </div>
  );
}
{/* <GoogleMapEmbed apiKey={googleApi} selectedCrime={selectedCrime} crimes={crimes} zoom={19} currentLocation={currentLocation} /> */ }