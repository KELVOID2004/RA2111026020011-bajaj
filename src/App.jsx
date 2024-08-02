import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [filters, setFilters] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleJsonInput = (e) => {
    setJsonInput(e.target.value);
  };

  const validateJson = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (validateJson(jsonInput)) {
      setError('');
      try {
        const res = await fetch('YOUR_BACKEND_API_URL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonInput,
        });
        const data = await res.json();
        setResponse(data);
      } catch (err) {
        setError('Failed to fetch data from API');
      }
    } else {
      setError('Invalid JSON input');
    }
  };

  const handleFilterChange = (filter) => {
    if (filters.includes(filter)) {
      setFilters(filters.filter((f) => f !== filter));
    } else {
      setFilters([...filters, filter]);
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;
    let filteredResponse = {};

    if (filters.includes('Numbers')) {
      filteredResponse.Numbers = response.Numbers;
    }
    if (filters.includes('Alphabets')) {
      filteredResponse.Alphabets = response.Alphabets;
    }
    if (filters.includes('Highest Alphabet')) {
      filteredResponse['Highest Alphabet'] = response['Highest Alphabet'];
    }

    return filteredResponse;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <textarea
          value={jsonInput}
          onChange={handleJsonInput}
          placeholder="Enter API Input"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-xs placeholder-top-left placeholder-opacity-75"
          style={{ 
            height: '100px',  // Fixed height to match the button
            resize: 'none'    // Disable resizing
          }}
        />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>

        {/* Dropdown Menu for Filters */}
        <div className="mt-4 relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded flex items-center justify-between"
          >
            Filters
            <ChevronDown className={`ml-2 h-4 w-4 transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg">
              <div className="px-4 py-2">
                {/* Dropdown Filter Options */}
                <button
                  className="w-full text-left py-2 hover:bg-gray-100"
                  onClick={() => handleFilterChange('Numbers')}
                >
                  Numbers {filters.includes('Numbers') && <X className="ml-2 h-4 w-4 inline" />}
                </button>
                <button
                  className="w-full text-left py-2 hover:bg-gray-100"
                  onClick={() => handleFilterChange('Alphabets')}
                >
                  Alphabets {filters.includes('Alphabets') && <X className="ml-2 h-4 w-4 inline" />}
                </button>
                <button
                  className="w-full text-left py-2 hover:bg-gray-100"
                  onClick={() => handleFilterChange('Highest Alphabet')}
                >
                  Highest Alphabet {filters.includes('Highest Alphabet') && <X className="ml-2 h-4 w-4 inline" />}
                </button>

                {/* Display Selected Filters */}
                {filters.length > 0 && (
                  <div className="mt-2 border-t border-gray-300 pt-2">
                    <div className="font-semibold text-sm mb-2">Selected Filters:</div>
                    {filters.map((filter) => (
                      <div
                        key={filter}
                        className="flex items-center justify-between py-1 px-2 bg-gray-100 rounded mb-1"
                      >
                        {filter}
                        <X className="h-4 w-4 cursor-pointer" onClick={() => handleFilterChange(filter)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Render Filtered Response */}
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Filtered Response</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {response ? JSON.stringify(renderFilteredResponse(), null, 2) : 'Submit valid JSON to see results'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
