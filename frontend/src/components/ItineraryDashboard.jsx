import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Bookmark, Map as MapIcon, Cloud, Clock, CircleDollarSign, Loader2, CheckCircle2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import MapRenderer from './MapRenderer';

export default function ItineraryDashboard({ data }) {
    const navigate = useNavigate();
    const printRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    React.useEffect(() => {
        if (!data) {
            navigate('/');
        }
    }, [data, navigate]);

    if (!data) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('SAVE BUTTON CLICKED');
        setIsSaving(true);
        try {
            const response = await axios.post('http://localhost:5001/api/itineraries/save', data);
            setSaveSuccess(true);
            console.log('Save response:', response.data);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportPDF = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('EXPORT PDF CLICKED');
        const element = printRef.current;
        if (!element) {
            console.error('Print ref element not found!');
            return;
        }

        setIsExporting(true);
        const opt = {
            margin: [0.3, 0.3],
            filename: `Itinerary_${data.userInput.destination}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: false,
                scrollY: -window.scrollY
            },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Trigger PDF generation
        html2pdf().set(opt).from(element).save()
            .then(() => {
                console.log('PDF exported successfully');
                setIsExporting(false);
            })
            .catch(err => {
                console.error('PDF export error:', err);
                setIsExporting(false);
            });
    };

    const { userInput, days, totalEstimatedCost } = data;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10 px-4 pt-4 relative">
            {/* Top Banner - Using high z-index and explicit positions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2 relative z-[100]">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold transition-all hover:translate-x-1 p-3 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Planner
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || saveSuccess}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-sm transition-all active:scale-95 cursor-pointer border ${saveSuccess
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4 text-indigo-500" />)}
                        {isSaving ? 'Saving...' : (saveSuccess ? 'Saved!' : 'Save')}
                    </button>
                    <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 cursor-pointer disabled:opacity-70"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isExporting ? 'Exporting...' : 'Export PDF'}
                    </button>
                </div>
            </div>

            <div ref={printRef} className="space-y-8 bg-slate-50/50 p-4 sm:p-0 rounded-3xl">
                {/* Header Section */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 via-slate-900 to-sky-900 opacity-90"></div>
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>

                    <div className="relative p-8 md:p-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Your trip to {userInput.destination}</h2>

                        <div className="flex flex-wrap gap-6 mt-6">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                <Clock className="w-5 h-5 text-sky-400" />
                                <span className="font-medium text-slate-200">{userInput.startDate} to {userInput.endDate}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                <CircleDollarSign className="w-5 h-5 text-green-400" />
                                <span className="font-medium text-slate-200">Budget: {userInput.budget} (Est. ${totalEstimatedCost})</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Itinerary Days */}
                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-200">
                            Day-by-Day Plan
                        </h3>

                        {days && days.map((day, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col pt-8 relative">
                                <div className="absolute -top-4 left-6 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                                    Day {day.day} • {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </div>

                                {day.weather && (
                                    <div className="flex items-center gap-2 mb-6 bg-sky-50 px-4 py-2 rounded-lg text-sky-800 self-start">
                                        <Cloud className="w-5 h-5" />
                                        <span className="font-medium">{day.weather.condition}, {day.weather.temp}°C</span>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {day.activities.map((activity, aIdx) => (
                                        <div key={aIdx} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-50 mt-1.5 group-hover:scale-125 transition-transform"></div>
                                                {aIdx !== day.activities.length - 1 && <div className="w-0.5 h-full bg-indigo-100 mt-2"></div>}
                                            </div>
                                            <div className="pb-4">
                                                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                                                    <span className="text-sm font-bold text-indigo-600 w-20">{activity.time}</span>
                                                    <h4 className="text-lg font-bold text-slate-800">{activity.title}</h4>
                                                </div>
                                                <p className="text-slate-600 leading-relaxed max-w-xl">{activity.description}</p>
                                                {activity.cost > 0 && (
                                                    <div className="mt-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block">
                                                        Est. ${activity.cost}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Maps & Summary */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1 sticky top-6">
                            <div className="w-full h-[400px] md:h-[500px] bg-slate-100 rounded-xl overflow-hidden relative">
                                <MapRenderer activities={days} />
                                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md py-2 px-4 rounded-lg shadow-lg border border-white/50 text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <MapIcon className="w-4 h-4 text-indigo-500" />
                                    Activity Locations
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
