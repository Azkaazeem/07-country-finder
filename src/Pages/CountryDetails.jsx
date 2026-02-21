import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loading from '../Comp/Loading';
import Swal from 'sweetalert2';
import { 
  ArrowLeft, Building2, Users, Globe2, 
  MapPin, Coins, Languages 
} from 'lucide-react';

export default function CountryDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountryDetail = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
        if (!response.ok) throw new Error('Country details not found or API is down.');
        
        const data = await response.json();
        setCountry(data[0]);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        Swal.fire({
          title: 'Error Fetching Data',
          text: err.message,
          icon: 'error',
          confirmButtonColor: '#3b82f6',
          confirmButtonText: 'Go Back'
        }).then(() => {
          navigate('/');
        });
      }
    };
    
    fetchCountryDetail();
  }, [name, navigate]);

  if (loading) return <Loading />;
  if (!country) return null;

  return (
    <div className="max-w-5xl mx-auto mt-6 animate-fade-in">
      
      {/* Premium Back Button - Ab Pakka Blue hai */}
      <Link 
        to="/" 
        className="group inline-flex items-center mb-8 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300 text-white" /> 
        Back to Dashboard
      </Link>
      
      {/* Main Detail Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-500 hover:shadow-2xl">
        <div className="flex flex-col lg:flex-row">
          
          <div className="w-full lg:w-1/2 p-6 lg:p-10 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
            <div className="relative group w-full overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <img 
                src={country.flags.svg} 
                alt={`Flag of ${country.name.common}`} 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center">
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2 tracking-tight">
              {country.name.common}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-8">
              {country.name.official}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Capital</p>
                  <p className="text-gray-900 dark:text-white font-semibold">{country.capital ? country.capital.join(', ') : 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Population</p>
                  <p className="text-gray-900 dark:text-white font-semibold">{country.population.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Region</p>
                  <p className="text-gray-900 dark:text-white font-semibold">{country.region}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sub Region</p>
                  <p className="text-gray-900 dark:text-white font-semibold">{country.subregion || 'N/A'}</p>
                </div>
              </div>

            </div>

            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Languages className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Languages</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {country.languages ? Object.values(country.languages).map((lang, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full shadow-sm">
                      {lang}
                    </span>
                  )) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Currencies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {country.currencies ? Object.values(country.currencies).map((curr, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full shadow-sm border border-blue-100 dark:border-blue-800">
                      {curr.name} ({curr.symbol})
                    </span>
                  )) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}