function Forecast({ data }) {
  if (!data || data.length === 0) return null;

  // pick 1 data per day (every 8th item ≈ 24 hrs)
  const dailyData = data.filter((_, index) => index % 8 === 0);

  return (
    <div className="forecast">
      {dailyData.map((item, index) => (
        <div key={index} className="forecast-card">
          <p>
            {new Date(item.dt_txt).toLocaleDateString("en-US", {
              weekday: "short",
            })}
          </p>

          <img
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
            alt=""
          />

          <p>{Math.round(item.main.temp)}°C</p>
        </div>
      ))}
    </div>
  );
}

export default Forecast;