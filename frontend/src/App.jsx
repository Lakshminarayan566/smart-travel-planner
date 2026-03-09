import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TravelForm from './components/TravelForm';
import ItineraryDashboard from './components/ItineraryDashboard';

function App() {
  const [itineraryData, setItineraryData] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 font-sans text-slate-800 selection:bg-indigo-500 selection:text-white pb-20">
        <header className="pt-10 pb-6 px-4 max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-500">SmartTravel</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 mt-8">
          <Routes>
            <Route
              path="/"
              element={<TravelForm setItineraryData={setItineraryData} />}
            />
            <Route
              path="/dashboard"
              element={<ItineraryDashboard data={itineraryData} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
