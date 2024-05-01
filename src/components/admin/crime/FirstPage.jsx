import React, { useState, useEffect, useMemo } from 'react'
import GoogleMapEmb from './GoogleMap';
import MapWithPolygon from './MapWithPolygon';

export default function FirstPage({ crimes }) {
    const [currentLocation, setCurrentLocation] = useState();
    const googleApi = process.env.REACT_APP_GOOGLE_API_KEY;
    const [updatedData, setUpdatedData] = useState(null);
    const [countPerBarangay, setCountPerBarangay] = useState([]);
    const [index, setIndex] = useState(false);
    const [nonIndex, setNonIndex] = useState(false);

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

    useEffect(() => {
        setCountPerBarangay(counts)
    }, [updatedData])

    useEffect(() => {
        setUpdatedData(memoizedUpdatedDataList);
    }, [memoizedUpdatedDataList]);

    // GET THE CURRENT LOCATION
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
        <div className='bg-white gap-2 w-full'>
            <div className='flex relative'>
                <div className='w-full'>
                    {
                        !updatedData ? "" :
                            <MapWithPolygon apiKey={googleApi} currentLocation={currentLocation} crimes={updatedData} index={index} nonIndex={nonIndex} />
                    }
                </div>
                <div className='w-56 p-2 absolute top-28 right-0 text-sm bg-black'>
                    {Object.entries(counts).map(([barangay, { index, nonIndex }]) => (
                        <div key={barangay}
                            className={`flex justify-between items-center gap-2 p-1 text-xs
                        ${barangay === 'Consuelo' ? 'bg-red-600' :
                                    barangay === 'Bunawan Brook' ? 'bg-yellow-400' :
                                        barangay === 'San Teodoro' ? 'bg-pink-300' :
                                            barangay === 'Libertad' ? 'bg-green-500' :
                                                barangay === 'San Andres' ? 'bg-orange-400' :
                                                    barangay === 'Imelda' ? 'bg-purple-600' :
                                                        barangay === 'Poblacion' ? 'bg-fuchsia-500' :
                                                            barangay === 'Mambalili' ? 'bg-teal-600' :
                                                                barangay === 'Nueva Era' ? 'bg-cyan-300'
                                                                    : 'bg-blue-500'}
                        `}>

                            <p className={` text-white p-2 font-bold
                            `}
                            >{barangay}</p>
                            <div className='text-white'>
                                <p className='text-xs'>Index: <span className='font-semibold'>{index}</span></p>
                                <p className='text-xs'>Non-Index: <span className='font-semibold'>{nonIndex}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex flex-col gap-1 w-48 p-2 absolute bg-black text-white bottom-24 right-0'>
                    <div className='flex gap-1'>
                        {/* <input type='checkbox' onClick={(e) => setIndex(!index)} checked={index} /> */}
                        <img src='http://localhost:3000/mark1.png' />
                        <p>Index Crimes</p>

                    </div>
                    <div className='flex gap-1'>
                        {/* <input type='checkbox' onClick={(e) => setNonIndex(!nonIndex)} checked={nonIndex} /> */}
                        <img src='http://localhost:3000/mark2.png' className='w-5' />
                        <p>Non-Index Crimes</p>

                    </div>
                </div>

            </div>
            {/* <div className=" bg-white ">
                {
                    currentLocation ?


                        <GoogleMapEmb currentLocation={currentLocation} apiKey={googleApi} crimes={updatedData} />
                        : 'Loading'
                }
            </div> */}
        </div>
    )
}
