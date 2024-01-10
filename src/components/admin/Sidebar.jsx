import React from "react";

export default function Sidebar({ activePage, handleActivePage, user }) {
  return (
    <div className="flex flex-col ps-2 min-h-screen text-start gap-5 pt-10 bg-neutral-800 text-yellow-500 text-md font-bold sticky top-0">
      <button
        className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
          activePage === "report tracker" ? "text-yellow-600 bg-slate-200" : ""
        }`}
        onClick={() => handleActivePage("report tracker")}
      >
        REPORT TRACKER
      </button>
      <button
        className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
          activePage === "person of concern"
            ? "text-yellow-600 bg-slate-200"
            : ""
        }`}
        onClick={() => handleActivePage("person of concern")}
      >
        PERSON OF CONCERN
      </button>
      <button
        className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
          activePage === "officer" ? "text-yellow-600 bg-slate-200" : ""
        }`}
        onClick={() => handleActivePage("officer")}
      >
        USER
      </button>
      <button
        className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
          activePage === "upload" ? "text-yellow-600 bg-slate-200" : ""
        }`}
        onClick={() => handleActivePage("upload")}
      >
        UPLOAD EXCEL
      </button>
    </div>
  );
}
