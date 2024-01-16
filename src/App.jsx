import { useState, useEffect, useRef } from "react";
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
  const [ totalCasesPerBrgy, setTotalCasesPerBrgy] = useState([]);
  const [wantedHistory, setWantedHistory] = useState([])
  const [missingHistory, setMissingHistory] = useState([])
  const [update, setUpdate] = useState(false);
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

      // Play the notification sound only in response to user interaction
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
                <ProneArea totalCasesPerBrgy={totalCasesPerBrgy}/>
              </div>
              <div className="w-full bg-white p-1">
                
                <Gmap crimes={crimes} />
              </div>
            </div>)}

        </section>
      )}
      <ToastContainer />
    </main>
  );
}

export default App;
