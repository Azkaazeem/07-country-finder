import { useState, useEffect } from 'react'
import CountryCard from '../Comp/CountryCard'
import Loading from '../Comp/Loading'
import Pagination from '../Comp/Pagination'

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3');
        if (!response.ok) throw new Error('Failed to fetch data from the API!');
        const data = await response.json();
        setCountries(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error: ", err); // For debugging
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 text-2xl mt-10">Error: {error}</div>;

  // Search Logic
  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8 max-w-md mx-auto">
        <input 
          type="text" 
          placeholder="Search country by name..." 
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 when user types in search
          }}
        />
      </div>

      {/* Grid Layout (Responsive) */}
      {currentCountries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentCountries.map((country, index) => (
            <CountryCard key={country.cca3 || index} country={country} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-xl mt-10">No countries found!</p>
      )}

      {/* Pagination Component */}
      <Pagination 
        totalItems={filteredCountries.length} 
        itemsPerPage={itemsPerPage} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
    </div>
  )
}