import React, { useState } from "react";
import axios from "axios";
import { Input } from "./ui/input"; // Assuming Input is a custom styled input component

function AutoSuggest({
  apiUrl,
  headers = {},
  params = {},
  onSelect,
  disable = false,
  debounceDelay = 300,
  placeholder = "Type to search...",
  inputClassName = "w-full p-2 border rounded-md mt-2 disabled:opacity-80",
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Fetch suggestions from the API
  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(apiUrl, {
        headers,
        params: { ...params, q: searchQuery },
      });
      const results = response.data?.data?.search_results || [];
      setSuggestions(results.map((item) => item.search_term));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setQuery(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      fetchSuggestions(value);
    }, debounceDelay);
    setDebounceTimeout(newTimeout);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    if (onSelect) onSelect(suggestion); // Notify parent component
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={inputClassName}
        disabled={disable}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md mt-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutoSuggest;
