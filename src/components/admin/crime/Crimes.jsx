import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import Select from 'react-select';


export default function Crimes({ accessToken }) {
    const [datas, setDatas] = useState([]);
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [offense, setOffense] = useState(null);
    const [barangay, setBarangay] = useState(null);
    const [year, setYear] = useState(null);
    const [totalCount, setTotalCount ] = useState(0);

    // SELECT OPTIONS
    const crimeTypeOpt = [

        { label: "CLEAR", value: "CLEAR" },
        { label: "Under Investigation", value: "Under Investigation" },
        {
            label: "ALARMS AND SCANDALS  - RPC Art. 155",
            value: "ALARMS AND SCANDALS  - RPC Art. 155",
        },
        {
            label:
                "AN ACT INCREASING THE PENALTIES FOR ILLEGAL NUMBERS GAMES, AMENDING CERTAIN PROVISIONS OF PD. NO. 1602, AND FOR OTHER PURPOSES - RA 9287 amending pd 1602",
            value:
                "AN ACT INCREASING THE PENALTIES FOR ILLEGAL NUMBERS GAMES, AMENDING CERTAIN PROVISIONS OF PD. NO. 1602, AND FOR OTHER PURPOSES - RA 9287 amending pd 1602",
        },
        {
            label:
                "ANTI-ELECTRICITY AND ELECTRIC TRANSMISSION LINES/MATERIALS PILFERAGE ACT OF 1994  - RA 7832",
            value:
                "ANTI-ELECTRICITY AND ELECTRIC TRANSMISSION LINES/MATERIALS PILFERAGE ACT OF 1994  - RA 7832",
        },
        {
            label: "ANTI-GAMBLING LAW  - PD 1602",
            value: "ANTI-GAMBLING LAW  - PD 1602",
        },
        {
            label: "ARSON OF PROPERTY OF SMALL VALUE  - RPC Art. 323",
            value: "ARSON OF PROPERTY OF SMALL VALUE  - RPC Art. 323",
        },
        {
            label: "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002  - RA 9165",
            value: "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002  - RA 9165",
        },
        {
            label:
                "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF DANGEROUS DRUGS - RA 9165 Article II Section 11",
            value:
                "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF DANGEROUS DRUGS - RA 9165 Article II Section 11",
        },
        {
            label:
                "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF EQUIPMENT, INSTRUMENT, APPARATUS AND OTHER PARAPHERNALIA FOR DANGEROUS DRUGS - RA 9165 Article II Section 12",
            value:
                "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - POSSESSION OF EQUIPMENT, INSTRUMENT, APPARATUS AND OTHER PARAPHERNALIA FOR DANGEROUS DRUGS - RA 9165 Article II Section 12",
        },
        {
            label:
                "COMPREHENSIVE LAW ON FIREARMS AND AMMUNITION  - RA 10591 (covers RA 9516, RA 8294, PD 1866)",
            value:
                "COMPREHENSIVE LAW ON FIREARMS AND AMMUNITION  - RA 10591 (covers RA 9516, RA 8294, PD 1866)",
        },
        {
            label: "DESTRUCTIVE ARSON  - RPC Art. 320 amended by PD 1613 and PD 1744",
            value: "DESTRUCTIVE ARSON  - RPC Art. 320 amended by PD 1613 and PD 1744",
        },
        {
            label: "DIRECT ASSAULTS  - RPC Art. 148",
            value: "DIRECT ASSAULTS  - RPC Art. 148",
        },
        {
            label: "DISCHARGE OF FIREARMS - RPC Art 254",
            value: "DISCHARGE OF FIREARMS - RPC Art 254",
        },
        {
            label:
                "HIGHGRADING OR THEFT OF GOLD FROM A MINING CLAIM OR MINING CAMP (PRESCRIBING A HEAVIER MINIMUM PENALTY FOR) - PD 581",
            value:
                "HIGHGRADING OR THEFT OF GOLD FROM A MINING CLAIM OR MINING CAMP (PRESCRIBING A HEAVIER MINIMUM PENALTY FOR) - PD 581",
        },
        { label: "HOMICIDE  - RPC Art. 249", value: "HOMICIDE  - RPC Art. 249" },
        {
            label:
                "ILLEGAL POSSESSION, MANUFACTURE, ACQUISITION, OF FIREARMS, AMMUNITION OR EXPLOSIVES - PD 1866 as amended by RA 8294 and RA 9516",
            value:
                "ILLEGAL POSSESSION, MANUFACTURE, ACQUISITION, OF FIREARMS, AMMUNITION OR EXPLOSIVES - PD 1866 as amended by RA 8294 and RA 9516",
        },
        {
            label:
                "KIDNAPPING AND SERIOUS ILLEGAL DETENTION  - RPC Art. 267 as amended by RA 18 and RA 1084",
            value:
                "KIDNAPPING AND SERIOUS ILLEGAL DETENTION  - RPC Art. 267 as amended by RA 18 and RA 1084",
        },
        {
            label: "LESS SERIOUS PHYSICAL INJURIES  - RPC Art. 265",
            value: "LESS SERIOUS PHYSICAL INJURIES  - RPC Art. 265",
        },
        {
            label: "LIGHT THREATS  - RPC Art. 283",
            value: "LIGHT THREATS  - RPC Art. 283",
        },
        {
            label: "MALICIOUS MISCHIEF  - RPC Art. 327",
            value: "MALICIOUS MISCHIEF  - RPC Art. 327",
        },
        { label: "MURDER  - RPC Art. 248", value: "MURDER  - RPC Art. 248" },
        {
            label:
                "NEW ANTI-CARNAPPING ACT OF 2016 - MC - RA 10883 (repealed RA 6539)",
            value:
                "NEW ANTI-CARNAPPING ACT OF 2016 - MC - RA 10883 (repealed RA 6539)",
        },
        {
            label: "OMNIBUS ELECTION CODE OF THE PHILIPPINES - BP 881",
            value: "OMNIBUS ELECTION CODE OF THE PHILIPPINES - BP 881",
        },
        {
            label: "OTHER FORMS OF TRESPASS  - RPC Art. 281",
            value: "OTHER FORMS OF TRESPASS  - RPC Art. 281",
        },
        { label: "PARRICIDE  - RPC Art. 246", value: "PARRICIDE  - RPC Art. 246" },
        {
            label: "PHILIPPINE MINING ACT OF 1995 - RA 7942",
            value: "PHILIPPINE MINING ACT OF 1995 - RA 7942",
        },
        {
            label: "QUALIFIED THEFT  - RPC Art. 310  as amended by BP Blg 71",
            value: "QUALIFIED THEFT  - RPC Art. 310  as amended by BP Blg 71",
        },
        {
            label: "QUALIFIED TRESPASS TO DWELLING  - RPC Art. 280",
            value: "QUALIFIED TRESPASS TO DWELLING  - RPC Art. 280",
        },
        {
            label: "RAPE WITH HOMICIDE - RPC Art. 266-B",
            value: "RAPE WITH HOMICIDE - RPC Art. 266-B",
        },
        {
            label:
                "RECKLESS IMPRUDENCE RESULTING TO DAMAGE TO PROPERTY - RPC Art 365",
            value:
                "RECKLESS IMPRUDENCE RESULTING TO DAMAGE TO PROPERTY - RPC Art 365",
        },
        {
            label: "RECKLESS IMPRUDENCE RESULTING TO HOMICIDE - RPC Art 365",
            value: "RECKLESS IMPRUDENCE RESULTING TO HOMICIDE - RPC Art 365",
        },
        {
            label:
                "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE DAMAGE TO PROPERTY - RPC Art 365",
            value:
                "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE DAMAGE TO PROPERTY - RPC Art 365",
        },
        {
            label: "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE HOMICIDE - RPC Art 365",
            value: "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE HOMICIDE - RPC Art 365",
        },
        {
            label:
                "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE PHYSICAL INJURY - RPC Art 365",
            value:
                "RECKLESS IMPRUDENCE RESULTING TO MULTIPLE PHYSICAL INJURY - RPC Art 365",
        },
        {
            label: "RECKLESS IMPRUDENCE RESULTING TO PHYSICAL INJURY - RPC Art 365",
            value: "RECKLESS IMPRUDENCE RESULTING TO PHYSICAL INJURY - RPC Art 365",
        },
        {
            label:
                "RESISTANCE AND DISOBEDIENCE TO A PERSON IN AUTHORITY OR THE AGENTS OF SUCH PERSON  - RPC Art. 151",
            value:
                "RESISTANCE AND DISOBEDIENCE TO A PERSON IN AUTHORITY OR THE AGENTS OF SUCH PERSON  - RPC Art. 151",
        },
        {
            label: "REVISED FORESTRY CODE OF THE PHILIPPINES - PD 705",
            value: "REVISED FORESTRY CODE OF THE PHILIPPINES - PD 705",
        },
        { label: "ROBBERY  - RPC Art. 293", value: "ROBBERY  - RPC Art. 293" },
        {
            label: "SERIOUS PHYSICAL INJURIES  - RPC Art. 263",
            value: "SERIOUS PHYSICAL INJURIES  - RPC Art. 263",
        },
        {
            label: "SLANDER (ORAL DEFAMATION) - RPC Art. 358",
            value: "SLANDER (ORAL DEFAMATION) - RPC Art. 358",
        },
        {
            label: "SLIGHT PHYSICAL INJURIES AND MALTREATMENT  - RPC Art. 266",
            value: "SLIGHT PHYSICAL INJURIES AND MALTREATMENT  - RPC Art. 266",
        },
        {
            label: "SWINDLING (ESTAFA)  - RPC Art. 315 as amended by PD 1689",
            value: "SWINDLING (ESTAFA)  - RPC Art. 315 as amended by PD 1689",
        },
        {
            label:
                "THE FORESTRY REFORM CODE OF THE PHILIPPINES (ILLEGAL LOGGING) - PD 705",
            value:
                "THE FORESTRY REFORM CODE OF THE PHILIPPINES (ILLEGAL LOGGING) - PD 705",
        },
        { label: "THEFT  - RPC Art. 308", value: "THEFT  - RPC Art. 308" },
        {
            label: "UNJUST VEXATIONS - RPC Art. 287",
            value: "UNJUST VEXATIONS - RPC Art. 287",
        },
    ];

    let barangayOpt = [{
        label: "CLEAR",
        value: "CLEAR"
    },
    {
        label: "Consuelo",
        value: "Consuelo"
    }, {
        label: "San Teodoro",
        value: "San Teodoro"
    }, {
        label: "Bunawan Brook",
        value: "Bunawan Brook"
    }, {
        label: "Libertad",
        value: "Libertad"
    }, {
        label: "San Andres",
        value: "San Andres"
    }, {
        label: "Imelda",
        value: "Imelda"
    }, {
        label: "Poblacion",
        value: "Poblacion"
    }, {
        label: "Mambalili",
        value: "Mambalili"
    }, {
        label: "Nueva Era",
        value: "Nueva Era"
    }, {
        label: "San Marcos",
        value: "San Marcos"
    }
    ];

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
            .get(`/crime/all`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    page: currentPage,
                    limit: 25,
                    offense: offense,
                    barangay: barangay,
                    year: year
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
    }, [currentPage, offense, barangay, year])
    return (
        <div className='flex flex-col gap-2 w-full p-3 bg-white text-sm'>
            <div className='border-b-2 border-slate-200 p-2'>
                <p>Filter:</p>
                <div className='ps-10 flex gap-2'>
                    <div className='flex flex-col gap-2 w-2/6'>
                        <label htmlFor="" className='ps-2'>Barangay</label>
                        <Select
                            options={barangayOpt}
                            value={{ label: barangay, value: barangay }}
                            onChange={(e) => setBarangay(e.value)}
                        />
                    </div>

                    <div className='flex flex-col gap-2 w-3/6'>
                        <label htmlFor="" className='ps-2'>Offense</label>
                        <Select
                            options={crimeTypeOpt}
                            value={{ label: offense, value: offense }}
                            onChange={(e) => setOffense(e.value)}
                        />
                    </div>

                    <div className='flex flex-col gap-2 w-1/6'>
                        <label htmlFor="" className='ps-2'>Year</label>
                        <Select
                            options={yearOpt}
                            value={{ label: year, value: year }}
                            onChange={(e) => setYear(e.value)}
                        />
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
