import { Link } from 'react-router-dom';

export default function CountryCard({ country }) {
  return (
    <Link 
      to={`/country/${country.name.common}`} 
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl dark:hover:shadow-blue-900/20 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in block"
    >
      <div className="overflow-hidden aspect-video">
        <img 
          src={country.flags.svg} 
          alt={`Flag of ${country.name.common}`} 
          className="w-full h-full object-cover border-b border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-extrabold mb-3 truncate text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {country.name.common}
        </h2>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-800 dark:text-gray-200">Population:</span> {country.population.toLocaleString()}</p>
          <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-800 dark:text-gray-200">Region:</span> {country.region}</p>
          <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-800 dark:text-gray-200">Capital:</span> {country.capital ? country.capital[0] : 'N/A'}</p>
        </div>
      </div>
    </Link>
  );
}