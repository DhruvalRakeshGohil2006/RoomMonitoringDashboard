import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  const [darkMode, setDarkMode] = useState(false);

  const isOnline = data && Date.now() - data.timestamp < 15000;
  
  const getAQIStatus = (aqi) => {
  if (aqi <= 50) return { text: "Good", color: "text-green-500" };
  if (aqi <= 100) return { text: "Moderate", color: "text-yellow-500" };
  if (aqi <= 150) return { text: "Unhealthy", color: "text-orange-500" };
  return { text: "Danger", color: "text-red-500" }; };

  useEffect(() => {
    const liveRef = ref(db, "devices/device1/live");
    const historyRef = ref(db, "devices/device1/history");

    onValue(liveRef, (snapshot) => {
      setData(snapshot.val());
    });

    onValue(historyRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const arr = Object.entries(val).map(([time, v]) => ({
          time,
          temp: v.temperature,
        }));
        setHistory(arr);
      }
    });
  }, []);

  const chartData = {
    labels: history.map((h) => new Date(Number(h.time)).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature",
        data: history.map((h) => h.temp),
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: darkMode ? "white" : "black",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: darkMode ? "white" : "black" },
      },
      y: {
        ticks: { color: darkMode ? "white" : "black" },
      },
    },
  };

  const getTempColor = (temp) => {
  if (temp < 20) return "text-blue-500";
  if (temp < 30) return "text-green-500";
  return "text-red-500";
  };

  const getHumidityColor = (h) => {
    if (h < 40) return "text-yellow-500";
    if (h < 70) return "text-green-500";
    return "text-blue-500";
  };

  const getLightColor = (l) => {
    if (l < 100) return "text-gray-500";
    if (l < 300) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
  <div className={`min-h-screen px-2 sm:px-0 transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-gray-100 to-purple-100"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className={`text-4xl md:text-5xl font-bold text-center mb-8 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}>
        Room Monitoring Dashboard
      </h1>

      <div className="flex justify-center sm:justify-end mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-5 py-2 rounded-xl shadow-lg transition ${
            darkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-900 text-white hover:bg-gray-700"
          }`}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {!data ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">

            <Card
              title="Device Status"
              value={isOnline ? "Online" : "Offline"}
              icon={isOnline ? "🟢" : "🔴"}
              color={isOnline ? "text-green-500" : "text-red-500"}
              darkMode={darkMode}
            />

            <Card
              title="Temperature"
              value={`${data.temperature} °C`}
              icon="🌡️"
              color={getTempColor(data.temperature)}
              darkMode={darkMode}
            />

            <Card
              title="Feels Like"
              value={`${data.feels_like ?? "--"} °C`}
              icon="🔥"
              color="text-orange-500"
              darkMode={darkMode}
            />

            <Card
              title="Humidity"
              value={`${data.humidity} %`}
              icon="💧"
              color={getHumidityColor(data.humidity)}
              darkMode={darkMode}
            />

            <Card
              title="Light"
              value={`${data.light} lx`}
              icon="💡"
              color={getLightColor(data.light)}
              darkMode={darkMode}
            />

          </div>

          {/* AQI */}
          <div className={`p-4 sm:p-6 rounded-2xl shadow mb-6 text-center ${
                  darkMode
                    ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white"
                    : "bg-white"
                }`}>
            <h2 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-black"}`}>AQI Status</h2>

            <p className={`text-2xl font-bold ${getAQIStatus(data.aqi).color}`}>
              {getAQIStatus(data.aqi).text}
            </p>

            <p className="text-gray-500">AQI Value: {data.aqi}</p>
          </div>

          {/* Graph */}
          <div className={`p-5 rounded-2xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`mb-4 font-semibold text-lg text-center ${darkMode ? "text-white" : "text-black"}`}>
              Temperature Trend
            </h2>
            <Line data={chartData} options={chartOptions} />
          </div>
        </>
      )}
      </div>
  </div>
);
}

function Card({ title, value, icon, color, darkMode }) {
  return (
    <div className={`p-4 sm:p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        darkMode
          ? "bg-gray-800/80 backdrop-blur-lg text-white hover:shadow-blue-500/20"
          : "bg-white/80 backdrop-blur-lg"
      }`}>
      
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-gray-400 text-xs sm:text-sm">{title}</h2>
        <span className="text-xl">{icon}</span>
      </div>

      <p className={`text-3xl font-bold ${color}`}>
        {value}
      </p>

      <div className="mt-2 sm:mt-4" />

    </div>
  );
}

export default App;