import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import {
  getWeather,
  getForecast,
  getForecastByCoords,
} from "./services/weatherService";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = () => {
    if (!weather) return;

    const cityName = weather.name;
    let updated;

    if (favorites.includes(cityName)) {
      updated = favorites.filter((c) => c !== cityName);
    } else {
      updated = [...favorites, cityName];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

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
            .catch(() => {});
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
      const weatherData = await getWeather(city);
      setWeather(weatherData);

      getForecast(city)
        .then((forecastData) => {
          setForecast(forecastData.list);
        })
        .catch(() => {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationWeather();
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  return (
    <div className="app">
      <h1>🌦️ Weather App</h1>

      <SearchBar
        city={city}
        setCity={setCity}
        handleSearch={handleSearch}
      />

      <div className="favorites">
        {favorites.map((city, index) => (
          <button
            key={index}
            onClick={() => {
              setCity(city);
              handleSearch();
            }}
          >
            {city}
          </button>
        ))}
      </div>

     <button className="location-btn" onClick={getLocationWeather}>
  📍 Use My Location
</button>

      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}

      <WeatherCard
        weather={weather}
        toggleFavorite={toggleFavorite}
        favorites={favorites}
      />

      <Forecast data={forecast} />
    </div>
  );
}

export default App;