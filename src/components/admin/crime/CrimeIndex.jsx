import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import Select from 'react-select';


export default function CrimeIndex({ accessToken }) {
    const [datas, setDatas] = useState([]);
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [offense, setOffense] = useState(null);
    const [barangay, setBarangay] = useState(null);
    const [year, setYear] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [isIndexCrime, setIsIndexCrime] = useState('true')

    const handleRadioChange = (event) => {
        setIsIndexCrime(event.target.value);
    };

    // SELECT OPTIONS

    const currentYear = new Date().getFullYear();
    const yearOpt = [];
    for (let year = currentYear; 2000 <= year; year--) {
        if (year === currentYear) {
            yearOpt.push({ label: "CLEAR", value: "CLEAR" })
        }
        yearOpt.push({ label: year, value: year });
    }

    // GET

    const getCrimes = async () => {
        await axios
            .get(`/crime/index`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    page: currentPage,
                    limit: 25,
                    isIndex: isIndexCrime
                }
            })
            .then((res) => {
                setDatas(res.data.data);
                setTotalCount(res.data.totalCount);
                setTotalPages(Math.ceil(res.data.totalCount / 25))
            });
    }


    useEffect(() => {
        getCrimes();
    }, [currentPage, isIndexCrime])
    return (
        <div className='flex flex-col gap-2 w-full p-3 bg-white text-sm'>
            <div className='border-b-2 border-slate-200 p-2'>
                <p>Filter:</p>
                <div className='flex ps-14 gap-5 w-2/6'>
                    <div className='flex items-center gap-1'>
                        <input type='radio' name='type' onChange={handleRadioChange} value={true} checked={isIndexCrime === 'true'} /> 
                        Index Crimes
                    </div>
                    <div className='flex items-center gap-1'>
                        <input type='radio' name='type' onChange={handleRadioChange} value={false} checked={isIndexCrime === 'false'} /> 
                        Non-Index Crimes
                    </div>
                </div>

            </div>
            <div className='py-2 px-2 bg-slate-100 flex items-center'>
                <p className='font-semibold text-slate-600'>Total Cases: <span className='font-bold'>{totalCount}</span></p>
            </div>
            <table>
                <thead className=''>
                    <tr className=''>
                        <th className='py-5'>Crime I.D</th>
                        <th>Barangay</th>
                        <th>Date Reported</th>
                        <th>Date Committed</th>
                        <th>Place/Type</th>
                        <th>Offense</th>
                        <th>Stages Felony</th>
                        <th>Case Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !datas ? "Loading..." :
                            datas.map(data => (
                                <tr className='border-b-2 border-slate-200 text-center hover:bg-slate-100'>
                                    <td className='p-1'>{data.id}</td>
                                    <td className='p-1'>{data.barangay}</td>
                                    <td className='p-1'>{data.date_reported}</td>
                                    <td className='p-1'>{data.date_committed}</td>
                                    <td className='p-1'>{data.type_place}</td>
                                    <td className='p-1'>{data.offense}</td>
                                    <td className='p-1'>{data.stages_felony}</td>
                                    <td className='p-1'><span className={`p-1 ${data.case_status === 'Cleared' ? 'bg-green-200' : data.case_status === 'Solved' ? 'bg-blue-200' : 'bg-amber-100'}`}>{data.case_status}</span></td>
                                    <td className='p-1'>{ }</td>
                                    <td className='p-1'>{ }</td>
                                    <td className='p-1'>{ }</td>
                                    <td className='p-1'>{ }</td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
            <div className='flex gap-5 justify-center w-full'>
                <Pagination currentPage={currentPage} totalPages={totalPages} maxDisplay={9} onPageChange={setCurrentPage} />
            </div>
        </div>
    )
}           
