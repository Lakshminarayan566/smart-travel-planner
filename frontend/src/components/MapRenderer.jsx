import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Marker Function
const createNumberedIcon = (number) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background-color: #4f46e5;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                border: 3px solid white;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                position: relative;
            ">
                ${number}
                <div style="
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 8px solid #4f46e5;
                "></div>
            </div>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42]
    });
};

function ChangeView({ center }) {
    const map = useMap();
    if (center) {
        map.setView(center, 13);
    }
    return null;
}

export default function MapRenderer({ activities }) {
    const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;

    const locations = [];
    let activityCount = 1;

    activities?.forEach(day => {
        day.activities?.forEach(activity => {
            if (activity.location && activity.location.lat && activity.location.lng) {
                locations.push({
                    position: [activity.location.lat, activity.location.lng],
                    name: activity.title || activity.name || 'Activity',
                    description: activity.description,
                    time: activity.time,
                    number: activityCount++
                });
            }
        });
    });

    const center = locations.length > 0 ? locations[0].position : [48.8566, 2.3522]; // Default Paris if none

    if (!apiKey) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl">
                <p className="text-slate-500 font-medium text-sm">LocationIQ API key missing</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative rounded-2xl overflow-hidden group">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
            >
                <ChangeView center={center} />
                <TileLayer
                    url={`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${apiKey}`}
                />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations.map((loc, index) => (
                    <Marker
                        key={index}
                        position={loc.position}
                        icon={createNumberedIcon(loc.number)}
                    >
                        <Popup className="premium-popup">
                            <div className="p-1 min-w-[150px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                                        {loc.number}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{loc.time}</span>
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">{loc.name}</h4>
                                <p className="text-xs text-slate-600 line-clamp-2">{loc.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-600 border border-slate-200/50 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                    {locations.length} Locations
                </div>
            </div>

            <div className="absolute bottom-4 left-4 z-[1000] bg-white/70 backdrop-blur px-2 py-0.5 rounded-lg text-[8px] font-bold text-slate-400 border border-slate-200/30 uppercase tracking-tighter">
                LocationIQ
            </div>
        </div>
    );
}
