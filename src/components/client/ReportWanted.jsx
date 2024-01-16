import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  regions,
  provinces,
  cities,
  barangays,
  regionByCode,
  provincesByCode,
  provinceByName,
} from "select-philippines-address";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReportWanted({ user, wantedHistory, getWantedHistory }) {
  const [details, setDetails] = useState({
    type: "WANTED PERSON",
    officer_id: user.id
  });
  const [loading, setLoading] = useState(false);

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
    });
  };
  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
    });
  };

  const genderOpt = [
    {label: "male", value: "male"},
    {label: "female", value: "female"},
  ]
  const typeOpt = [
    {label: "MISSING PERSON", value: "MISSING PERSON"},
    {label: "WANTED PERSON", value: "WANTED PERSON"},
  ]
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

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if (!details.type) return showErrorMessage("Please select type.")
    if (!details.first_name) return showErrorMessage("Please select first name.")
    if (!details.gender) return showErrorMessage("Please select gender.")
    console.log(details)
    await axios
      .post("/person", details)
      .then(async (res) => {
        setLoading(false);
        showSuccessMessage(`${details.type} Reported Successfully.`)
        await axios.post('/personHistory', { officer_id: user.id, type: 'wanted' })
          .then(res => console.log(res)).catch(error => console.log(error))
          getWantedHistory();
          setDetails({...details, first_name: "", last_name: "", gender: "", alias: "", last_known_address: ""})
      })
      .catch((error) => {
        console.log(error);
        showErrorMessage(
          error.response.data.error + ". " + error.response.data.message
        );
        setLoading(false);
      });
  }

  return (
    <div className="w-full justify-center flex gap-2">
    <ToastContainer />
      <form className="w-full sm:w-5/6 my-6 mx-auto ">
        {/*content*/}
        <div className="border-0 rounded-lg flex flex-col w-full bg-white">
          {/*header*/}
          <p className="px-5 pt-5 font-serif font-bold text-2xl">REPORT WANTED PERSON</p>
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <button className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"></button>
          </div>
          {/*body*/}

          <div className="relative w-full flex flex-col gap-2 p-6 flex-auto">

            {/* First Row */}
            <div className="flex gap-2">
              <div className="flex w-3/6 flex-col">
                <label className="ps-2">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                  value={details.first_name}
                  onChange={(e) => setDetails({...details, first_name: e.target.value})}
                />
              </div>
              <div className="flex w-3/6 flex-col">
                <label className="ps-2">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                  value={details.last_name}
                  onChange={(e) => setDetails({...details, last_name: e.target.value})}
                />
              </div>
            </div>
            {/* 2nd Row */}
            <div className="flex gap-2">
              <div className="flex w-3/6 flex-col">
                <label className="ps-2">Gender</label>
                <Select
                  options={genderOpt}
                  value={{label: details.gender, value: details.gender}}
                  onChange={(e) =>
                    setDetails({ ...details, gender: e.value })
                  }
                />
              </div>
              <div className="flex w-3/6 flex-col">
                <label className="ps-2">Alias</label>
                <input
                  type="text"
                  placeholder="Alias"
                  className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                  value={details.alias}
                  onChange={(e) => setDetails({...details, alias: e.target.value})}

                />
              </div>
            </div>
            <div className="flex w-6/6 flex-col">
                <label className="ps-2">Last Known Address</label>
                <input
                  type="text"
                  placeholder="Last Known Address"
                  className="shadow-md px-3 py-1 rounded-md border-2 border-slate-400"
                  value={details.last_known_address}
                  onChange={(e) => setDetails({...details, last_known_address: e.target.value})}

                />
              </div>
              <div className="flex w-6/6 flex-col">
                <label className="ps-2">Type</label>
                <Select
                  value={{label: details.type, value: details.type}}
                  onChange={(e) =>
                    setDetails({ ...details, type: e.value })
                  }
                />
              </div>
          </div>
          {/*footer*/}
          <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">

            <button
              className="bg-emerald-500 w-2/6 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handleSubmit}
            >
              Report
            </button>
          </div>
        </div>
      </form>
      <div className="w-1/6 bg-white mt-6 rounded-md p-2 max-h-96 overflow-y-scroll">
        <p className="font-bold">Reported History</p>

        {
          !wantedHistory ? <>Loading...</> :
            wantedHistory.map((data) => (
              <div className="w-full p-2 border-b-2 border-slate-300">
                <p><span className="font-semibold">Name:</span> {data.first_name + ', ' + data.last_name}</p>
                <p><span className="font-semibold">Alias:</span> {data.alias}</p>
                <p><span className="font-semibold">Date:</span>  {getSpecificDate(data.created_at)}</p>
              </div>
            ))
        }
      </div>
    </div>
  );
}
