import React, { useState } from 'react';

export default function OfficerTable({ officerList, setSelectedOfficer, handleModal }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
console.log(officerList)
  const handleImageModal = (action) => {
    setIsModalOpen(action);
  };

  return (
    <table className="table table-auto w-full text-sm">
      <thead className="bg-slate-100">
        <tr>
          <th className="p-2">I.D</th>
          <th className="p-2">First Name</th>
          <th className="p-2">Last Name</th>
          <th className="p-2">email</th>
          <th className="p-2">I.D</th>
          <th className="p-2">Role</th>
          <th className="p-2">Activate</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {officerList.map((person) =>(
          
          <tr key={person.id} className="text-center bg-slate-50">
            <td className="p-4">{person.id}</td>
            <td>{person.first_name}</td>
            <td>{person.last_name}</td>
            <td>{person.email}</td>
            <td>
              <img className='w-20 cursor-pointer' src={`data:image/jpeg;base64,${person.url}`} alt='ID' onClick={(e) => handleImageModal(true)} />
              {isModalOpen && (
                <>
                  <div className="absolute top-0 left-0">
                    <div className="z-40 w-screen h-screen flex justify-center items-center">
                      
                      <div className='relative w-2/6 z-50'>
                        <img src={`data:image/jpeg;base64,${person.url}`} alt="Full Size" className='w-full z-50' />
                        <span className="cursor-pointer absolute top-5 right-5 text-2xl shadow-lg text-white hover:text-slate-400 duration-200" onClick={(e) => handleImageModal(false)}>&times;</span>
                      </div>
                    </div>
                  </div>
                  <div className='w-screen h-screen absolute bg-black opacity-30 z-10 top-0 left-0'></div>
                </>

              )}
            </td>
            <td>{person.role}</td>
            <td>{person.activate === 0 ? "False" : "True"}</td>
            <td className="flex gap-2 justify-center items-center p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pencil-fill text-emerald-500 cursor-pointer"
                viewBox="0 0 16 16"
                onClick={() => { setSelectedOfficer(person); handleModal(true) }}
              >
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
              </svg>
            </td>
          </tr>
        ))}

      </tbody>
    </table>
  )
}
