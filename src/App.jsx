import { Outlet } from 'react-router-dom';
import Header from './Comp/Header';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500 selection:bg-blue-500 selection:text-white">
      <Header />
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <Outlet /> 
      </main>
    </div>
  );
}