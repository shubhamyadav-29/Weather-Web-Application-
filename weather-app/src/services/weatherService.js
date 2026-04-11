const API_KEY = "85769b120cd7e6b47719cc93d08a5308";

// ✅ NAMED EXPORT
export const getWeather = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error("City not found");
  }

  return response.json();
};

// ✅ ALSO ADD THIS (forecast)
export const getForecast = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error("Forecast not found");
  }

  return response.json();
};

export const getForecastByCoords = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric`
  );

  if (!response.ok) {
    throw new Error("Forecast not found");
  }

  return response.json();
};