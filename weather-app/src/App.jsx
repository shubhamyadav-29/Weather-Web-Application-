import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import { getWeather, getForecast } from "./services/weatherService";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]); // ✅ added
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const handleSearch = async () => {
  //   if (!city.trim()) {
  //     setError("Please enter a city name");
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");
  //   setWeather(null);
  //   setForecast([]); // ✅ reset forecast

  //   try {
  //     const weatherData = await getWeather(city);
  //     const forecastData = await getForecast(city);

  //     setWeather(weatherData);
  //     setForecast(forecastData.list); // ✅ store forecast
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    // ✅ Load weather FIRST (fast)
    const weatherData = await getWeather(city);
    setWeather(weatherData);

    // ✅ Load forecast in background (no wait)
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

  const weatherType = weather?.weather?.[0]?.main;

  const getBackground = () => {
    switch (weatherType) {
      case "Clear":
        return "linear-gradient(to right, #56ccf2, #2f80ed)";
      case "Rain":
        return "linear-gradient(to right, #373b44, #4286f4)";
      case "Clouds":
        return "linear-gradient(to right, #bdc3c7, #2c3e50)";
      case "Smoke":
        return "linear-gradient(to right, #757f9a, #d7dde8)";
      default:
        return "linear-gradient(to right, #0f172a, #1e3a8a)";
    }
  };

  return (
    <div className="app" style={{ background: getBackground() }}>
      <h1>🌦️ Weather App</h1>

      <SearchBar
        city={city}
        setCity={setCity}
        handleSearch={handleSearch}
      />

      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}

      <WeatherCard weather={weather} />

      {/* ✅ Forecast added */}
      {forecast.length === 0 && weather && <p>Loading forecast...</p>}
      <Forecast data={forecast} />
    </div>
  );
}

export default App;