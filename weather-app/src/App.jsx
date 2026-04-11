import { useState, useEffect } from "react"; // ✅ combine import
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import { getWeather, getForecast, getForecastByCoords } from "./services/weatherService";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 👇 YOUR FUNCTION (must be above useEffect)
  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
      const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=85769b120cd7e6b47719cc93d08a5308&units=metric`
);

          const data = await response.json();
          setWeather(data);

          getForecastByCoords(latitude, longitude)
            .then((forecastData) => {
              setForecast(forecastData.list);
            })
            .catch(() => console.log("Forecast failed"));

        } catch {
          setError("Failed to fetch location weather");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      }
    );
  };

  // 👇 ADD HERE (inside function, before return)
  useEffect(() => {
    getLocationWeather();
  }, []);

  const handleSearch = async () => {
  if (!city.trim()) {
    setError("Please enter a city name");
    return;
  }

  setLoading(true);
  setError("");
  setWeather(null);
  setForecast([]);

  try {
    // ✅ show weather first (fast)
    const weatherData = await getWeather(city);
    setWeather(weatherData);

    // ✅ load forecast in background
    getForecast(city)
      .then((forecastData) => {
        setForecast(forecastData.list);
      })
      .catch(() => {
        console.log("Forecast failed");
      });

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="app">
      <h1>🌦️ Weather App</h1>

      <SearchBar
        city={city}
        setCity={setCity}
        handleSearch={handleSearch}
      />

      <button onClick={getLocationWeather}>
        📍 Use My Location
      </button>

      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}

      <WeatherCard weather={weather} />
      <Forecast data={forecast} />
    </div>
  );
}

export default App;