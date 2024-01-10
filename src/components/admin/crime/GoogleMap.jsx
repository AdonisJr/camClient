import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';


export default function GoogleMap({ apiKey, crimes, currentLocation }) {
  const currentPosition = {
    lat: 8.222376,
    lng: 125.990180,
  };

  const getSpecificDate = (created_at) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const date = new Date(created_at);
    const longDate = date.toLocaleDateString("en-US", options);
    return longDate;
  };

  return (
    <APIProvider apiKey={apiKey}>
      <p className='p-4 text-xl font-bold text-slate-500'>Crimes Visualization</p>
      <div className='w-full h-screen bg-red-500'>
        <Map center={currentPosition} zoom={15} mapId={"73ea4a8d7bc51562"}>
          <Marker position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }} title={"YOUR CURRENT LOCATION"} />
          {crimes.map((crime) => (
            crime.latitude === null || crime.longitude === null ? <div key={crime.id}></div> :
              <Marker
                key={crime.id}
                position={{ lat: crime.latitude, lng: crime.longitude }}
                title={`Offense: ${crime.offense} \n Date Committed: ${getSpecificDate(crime.date_committed)} \n Time Committed: ${crime.time_committed} \n Stages Felony: ${crime.stages_felony} \n Case Status: ${crime.case_status}`}
                icon={"http://localhost:3000/markIcon.svg"} />
          ))

          }
        </Map>
      </div>
    </APIProvider>
  )
}
