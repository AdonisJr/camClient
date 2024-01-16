import MousePositionProvider from "./MousePositionProvider";
export default function CustomTooltip({ active, payload, label, e }) {
    console.log(payload[0])
    if (active && payload && payload.length) {

        return (
            // <div className="w-96 h-96 relative overflow-y-auto">
            <div className="bg-white relative rounded-md p-2 h-auto shadow-lg z-50 overflow-y-scroll">
                <p className="font-bold">{`Barangay: ${label}`}</p>
                <p>{`Total Cases: ${payload[0].payload.total_cases}`}</p>
                {
                    payload[0].payload.offenses.map((data) => (
                        <div className="border-b-2 border-slate-200 ps-2 text-sm">
                            <p><span className="font-semibold">Offence:</span> {data.offense}</p>
                            <p><span className="font-semibold"> Count:</span>  {data.count_per_barangay}</p>
                            {/* <p>{data.}</p> */}
                        </div>
                    ))
                }
                Add additional data here
            </div>

            // </div>
        );
    }

    return null;
};
// import MousePositionProvider from "./MousePositionProvider";

// export default function CustomTooltip({ active, payload, label, e }) {
//     // payload[0].payload.offense.map((data)=>console.log(data.offense))
//     console.log(payload[0])
//     if (active && payload && payload.length) {
//         return (
//             <MousePositionProvider>
//             <p>WEWE</p>
//                 {(mousePosition) => (
//                     <div
//                         className="bg-white rounded-md p-2 w-96 h-96 overflow-x-scroll overflow-y-auto shadow-lg z-50"
//                         style={{
//                             left: `${mousePosition.x}px`,
//                             top: `${mousePosition.y}px`,
//                         }}
//                     >
//                     <p>WEWEW</p>
//                         {/* <p className="font-bold">{`Barangay: ${label}`}</p>
//                         <p>{`Total Cases: ${payload[0].payload.total_cases}`}</p>
//                         {
//                             payload[0].payload.offenses.map((data) => (
//                                 <div className="border-b-2 border-slate-200 ps-2 text-sm">
//                                     <p><span className="font-semibold">Offence:</span> {data.offense.split(" ").join(4)}</p>
//                                     <p><span className="font-semibold">Count:</span>  {data.count_per_barangay}</p>
//                                 </div>
//                             ))
//                         } */}
//                         {/* Add additional data here */}
//                     </div>
//                 )}
//             </MousePositionProvider>
//         );
//     }

//     return null;
// };
