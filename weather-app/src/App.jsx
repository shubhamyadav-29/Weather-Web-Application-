import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const handleSearch = () => {
    console.log("Searching for:", city);

    // API will be added in next step
  };

  return (
    <div className="app">
      <h1>🌦️ Weather App</h1>

      <SearchBar city={city} setCity={setCity} handleSearch={handleSearch} />

      <WeatherCard weather={weather} />
    </div>
  );
}

export default App;
