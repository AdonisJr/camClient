import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import Select from 'react-select';
import { useReactToPrint } from 'react-to-print';


export default function CrimeIndex({ accessToken }) {
    const [datas, setDatas] = useState([]);
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [offense, setOffense] = useState(null);
    const [barangay, setBarangay] = useState(null);
    const [year, setYear] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [isIndexCrime, setIsIndexCrime] = useState('true')
    const printRef = React.useRef();

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

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        pageStyle: `
            @page {
                margin: 10mm; /* Adjust margin size as needed */
            }
            `,
    });


    useEffect(() => {
        getCrimes();
    }, [currentPage, isIndexCrime])
    return (
        <div className='flex flex-col gap-2 w-full p-3 bg-white text-sm'>
            <div className='border-b-2 border-slate-200 p-2'>
                <p>Filter:</p>
                <div className='flex ps-14 gap-5 justify-between px-5'>
                    <div className='flex w-2/6 gap-2'>
                        <div className='flex items-center gap-1'>
                            <input type='radio' name='type' onChange={handleRadioChange} value={true} checked={isIndexCrime === 'true'} />
                            Index Crimes
                        </div>
                        <div className='flex items-center gap-1'>
                            <input type='radio' name='type' onChange={handleRadioChange} value={false} checked={isIndexCrime === 'false'} />
                            Non-Index Crimes
                        </div>
                    </div>
                    <div>
                        <button className='flex gap-2 items-center hover:text-slate-600 duration-200' onClick={handlePrint}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
                                <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1" />
                                <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                            </svg>
                            Print
                        </button>
                    </div>

                </div>

            </div>
            <div className='py-2 px-2 bg-slate-100 flex items-center'>
                <p className='font-semibold text-slate-600'>Total Cases: <span className='font-bold'>{totalCount}</span></p>
            </div>
            <table ref={printRef} className='text-xs'>
                <thead className=''>
                    <tr className='ps-5'>
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
                <tbody className='ps-5'>
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
