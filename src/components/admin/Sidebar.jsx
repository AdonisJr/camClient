import React from "react";

export default function Sidebar({ activePage, handleActivePage, user }) {
  return (
    <div className="flex flex-col ps-2 min-h-screen text-start gap-5 pt-10 bg-neutral-800 text-yellow-500 text-md font-bold sticky top-0">
      <button
        className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
          activePage === "Overview" ? "text-yellow-600 bg-slate-200" : ""
        }`}
        onClick={() => handleActivePage("Overview")}
      >
        Overview
      </button>
      <button
        className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
          activePage === "person of concern"
            ? "text-yellow-600 bg-slate-200"
            : ""
        }`}
        onClick={() => handleActivePage("person of concern")}
      >
        Person of Concern
      </button>
      <button
        className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
          activePage === "officer" ? "text-yellow-600 bg-slate-200" : ""
        }`}
        onClick={() => handleActivePage("officer")}
      >
        User List
      </button>
      <button
        className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
          activePage === "crimes" ? "text-yellow-600 bg-slate-200" : ""
        }`}
        onClick={() => handleActivePage("crimes")}
      >
        Crime List
      </button>
      <button
        className={`hover:text-yellow-600 duration-200 p-2 rounded-t-sm ${
          activePage === "crime index" ? "text-yellow-600 bg-slate-200" : ""
        }`}
        onClick={() => handleActivePage("crime index")}
      >
        Crime Index/Non
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
