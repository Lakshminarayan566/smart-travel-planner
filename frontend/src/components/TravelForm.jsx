import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Users, Wallet, Heart, Sparkles } from 'lucide-react';

const INTERESTS = ['Nature', 'History', 'Food', 'Adventure', 'Shopping', 'Art', 'Nightlife', 'Relaxation'];

export default function TravelForm({ setItineraryData }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: 'Medium',
        travelers: 2,
        interests: []
    });

    const handleInterestToggle = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Pointing to local backend, change to production URL later
            const response = await axios.post('http://localhost:5001/api/itineraries/generate', formData);
            setItineraryData({ ...response.data, userInput: formData });
            navigate('/dashboard');
        } catch (error) {
            console.error('GENERATE ERROR:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            alert(`Failed to generate: ${error.message}. Check console for details.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-4">
                    Design your dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-400">journey</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-xl mx-auto">
                    Tell us about your next adventure, and our AI will craft a personalized day-by-day travel plan instantly.
                </p>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-100/50 rounded-3xl p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Destination */}
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <MapPin className="w-4 h-4 text-indigo-500" />
                                Destination City
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Tokyo, Paris, Bali"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            />
                        </div>

                        {/* Dates */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                Start Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                End Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>

                        {/* Budget & Travelers */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Wallet className="w-4 h-4 text-indigo-500" />
                                Budget Scope
                            </label>
                            <select
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            >
                                <option value="Low">Low - Backpacker</option>
                                <option value="Medium">Medium - Comfortable</option>
                                <option value="High">High - Luxury</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Users className="w-4 h-4 text-indigo-500" />
                                Travelers
                            </label>
                            <input
                                type="number"
                                min="1"
                                required
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                value={formData.travelers}
                                onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    {/* Interests */}
                    <div className="space-y-4 pt-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Heart className="w-4 h-4 text-pink-500" />
                            What do you love?
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {INTERESTS.map(interest => {
                                const isSelected = formData.interests.includes(interest);
                                return (
                                    <button
                                        type="button"
                                        key={interest}
                                        onClick={() => handleInterestToggle(interest)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${isSelected
                                            ? 'bg-indigo-500 text-white border-transparent shadow-md shadow-indigo-200 scale-105'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transform transition-all hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2 text-lg"
                    >
                        {loading ? (
                            <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Generate My Plan
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
