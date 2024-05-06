import { useState, useEffect, useRef, useMemo } from "react";
import Cookies from "universal-cookie";
import "./App.css";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import ReportWanted from "./components/client/ReportWanted";
import ReportCrime from "./components/client/ReportCrime";
import ReportMissing from "./components/client/ReportMissing";
import Gmap from "./components/client/Gmap";
import io from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notificationSound from './assets/notificationsound.mp3';
import ProneArea from "./components/client/ProneArea";
import PolygonMap from "./components/admin/crime/PolygonMap";

const socket = io.connect("http://localhost:3001");

function App() {
  const cookies = new Cookies({ path: "/" });
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState({});
  const [activePage, setActivePage] = useState("home");
  const [person, setPerson] = useState("");
  const date = new Date();
  const currentDate = date.toISOString().slice(0, 10);
  const [crimes, setCrimes] = useState("");
  const [history, setHistory] = useState([]);
  const [message, setMessages] = useState();
  const prevMessagesRef = useRef([]);
  const [totalCasesPerBrgy, setTotalCasesPerBrgy] = useState([]);
  const [wantedHistory, setWantedHistory] = useState([])
  const [missingHistory, setMissingHistory] = useState([])
  const [update, setUpdate] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);
  const [countPerBarangay, setCountPerBarangay] = useState([]);
  // handle FUNCTIONS

  const handleActivePage = (page) => {
    setActivePage(page);
  };

  // GET FUNCTIONS


  const getTotalCasesPerBrgy = async () => {
    await axios
      .get(`/crime/countCasesPerBrgy`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setTotalCasesPerBrgy(res.data.data);
      });
  }
  const getHistory = async () => {
    await axios
      .get(`/history?officer_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setHistory(res.data.data);
      });
  };
  const getWantedHistory = async () => {
    await axios
      .get(`/personHistory?officer_id=${user.id}&type=wanted`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log(res.data.data)
        setWantedHistory(res.data.data);
      });
  };
  const getMissingHistory = async () => {
    await axios
      .get(`/personHistory?officer_id=${user.id}&type=missing`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setMissingHistory(res.data.data);
      });
  };

  const getCrimes = async () => {
    await axios
      .get(`/crime`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setCrimes(res.data.data);
      });
  };
  // SET USER / LOGGED IN

  useEffect(() => {
    // return console.log(decoded.data.id)
    const getUser = async () => {
      if (cookies.get("user")) {
        const token = cookies.get("user");
        const decoded = jwt_decode(token.data);
        await axios
          .get(`/user/?id=${decoded.id}`, {
            headers: {
              Authorization: `Bearer ${token.data}`,
            },
          })
          .then((res) => {
            if (res.data.data[0].role === "admin") return navigate("/admin");
            setUser(res.data.data[0]);
          });
        setAccessToken(token.data);
      }
    };
    getUser();
    getCrimes();
    getTotalCasesPerBrgy();
  }, []);
  useEffect(() => {
    if (user.id) {
      getHistory();
      getWantedHistory();
      getMissingHistory();
    }
  }, [user, update])

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
    console.log(memoizedUpdatedDataList)
  }, [memoizedUpdatedDataList]);


  // SOCKET
  useEffect(() => {
    // Listen for messages from the server
    socket.on('receive_message', (message) => {
      // Display a toast notification when a new message arrives with a 5-minute duration
      
      toast.warning(
        `Crime Awareness: ${message.message}`,
        {
          autoClose: 8000, // 5 minutes in milliseconds
          icon: '🚨',
        }
      );

      // // Play the notification sound only in response to user interaction
      playNotificationSound();

    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const playNotificationSound = () => {
    // Create a new Audio object and play the notification sound
    const audio = new Audio(notificationSound);
    if (audio.play && typeof audio.play === 'function') {
      audio.play().catch((error) => {
        console.error('Autoplay failed:', error);
      });
    }
  };


  return (
    <main className="flex flex-col min-h-screen max-w-screen bg-slate-200 overflow-x-hidden overflow-hidden">
      <Header
        user={user}
        handleActivePage={handleActivePage}
        setUser={setUser}
        setAccessToken={setAccessToken}
        accessToken={accessToken}
      />
      {!accessToken ? (
        <p className="bg-red-200 shadow-md p-2 m-2 rounded-lg text-center text-slate-500 font-bold">
          Please login to access this page.
        </p>
      ) : (
        <section className="flex flex-col p-5">
          {activePage === "wanted" ? (
            <ReportWanted user={user} accessToken={accessToken} wantedHistory={wantedHistory} getWantedHistory={getWantedHistory} />
          ) : activePage === "crime" ? (
            !user ? <>Loading...</> : <ReportCrime user={user} history={history} getHistory={getHistory} setUpdate={setUpdate} update={update} />
          ) : activePage === "missing" ? (
            <ReportMissing user={user} missingHistory={missingHistory} getMissingHistory={getMissingHistory} />
          ) : (!crimes ? <>Loading...</> :
            <div className="flex flex-col gap-5">
              <div className="w-full bg-white rounded-md p-2 px-5 ">
                <ProneArea totalCasesPerBrgy={totalCasesPerBrgy} />
              </div>
              {/* <div className="w-full bg-white p-1">

                <Gmap crimes={crimes} />
              </div> */}
              <div className='flex relative'>
                <div className='w-full'>
                  {
                    !updatedData ? "" :
                      <PolygonMap crimes={updatedData} />
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
            </div>)}

        </section>
      )}
      <ToastContainer />
    </main>
  );
}

export default App;
