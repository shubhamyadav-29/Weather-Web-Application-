import { useState, useEffect, useRef } from "react";
import { getCitySuggestions } from "../services/weatherService";

function SearchBar({ city, setCity, handleSearch }) {
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(); // ✅ INSIDE component

  useEffect(() => {
    if (city.length < 2) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(() => {
      getCitySuggestions(city).then((data) => {
        setSuggestions(data);
      });
    }, 400);

    return () => clearTimeout(delay);
  }, [city]);

  // ✅ Outside click logic (INSIDE component)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-bar" ref={searchRef}>
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button
        onClick={() => {
          handleSearch();
          setSuggestions([]);
        }}
      >
        Search
      </button>

      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((item, index) => (
            <p
              key={index}
              onClick={() => {
                setCity(item.name);
                setSuggestions([]);
              }}
            >
              <span>{item.name}</span>
              <span style={{ opacity: 0.6, fontSize: "12px" }}>
                {item.state ? item.state + ", " : ""}
                {item.country}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;