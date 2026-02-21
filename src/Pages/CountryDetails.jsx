import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from '../Comp/Loading';

export default function CountryDetails() {
  const { name } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryDetail = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
        if (!response.ok) throw new Error('Country details not found!');
        const data = await response.json();
        setCountry(data[0]);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error: ", err); // For debugging
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCountryDetail();
  }, [name]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 text-2xl mt-10">Error: {error}</div>;
  if (!country) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-6 md:p-10 mt-6">
      <Link to="/" className="inline-block mb-6 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition">
        &larr; Back to Home
      </Link>
      
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2">
          <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} className="w-full h-auto rounded border shadow-sm" />
        </div>
        
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-bold mb-6 text-blue-900">{country.name.common}</h1>
          <div className="space-y-3 text-lg text-gray-700">
            <p><strong className="text-black">Official Name:</strong> {country.name.official}</p>
            <p><strong className="text-black">Capital:</strong> {country.capital ? country.capital.join(', ') : 'N/A'}</p>
            <p><strong className="text-black">Population:</strong> {country.population.toLocaleString()}</p>
            <p><strong className="text-black">Region:</strong> {country.region}</p>
            <p><strong className="text-black">Subregion:</strong> {country.subregion || 'N/A'}</p>
            
            <p><strong className="text-black">Languages:</strong> {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
            <p><strong className="text-black">Currencies:</strong> {
              country.currencies 
              ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ')
              : 'N/A'
            }</p>
          </div>
        </div>
      </div>
    </div>
  )
}