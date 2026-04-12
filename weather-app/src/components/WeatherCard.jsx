function WeatherCard({ weather, toggleFavorite, favorites = [] }) {
  if (!weather || !weather.weather) return null;

  const icon = weather.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="weather-card">
      <h2>
        {weather.name}, {weather.sys.country}
      </h2>

      <button onClick={toggleFavorite} className="fav-btn">
        {favorites.includes(weather.name) ? "❤️" : "🤍"}
      </button>

      <img src={iconUrl} alt="weather icon" />

      <p className="temp">{weather.main.temp}°C</p>

      <p style={{ fontSize: "14px", opacity: 0.7 }}>
        Feels like: {weather.main.feels_like}°C
      </p>

      <p style={{ textTransform: "capitalize" }}>
        {weather.weather[0].description}
      </p>

      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherCard;