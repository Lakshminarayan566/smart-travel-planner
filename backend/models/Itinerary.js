import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    interests: [{ type: String }],
    travelers: { type: Number, required: true },
    days: [
        {
            day: { type: Number },
            date: { type: Date },
            weather: {
                condition: String,
                temp: Number,
                icon: String
            },
            activities: [
                {
                    time: String,
                    title: String,
                    description: String,
                    location: {
                        lat: Number,
                        lng: Number
                    },
                    cost: Number
                }
            ]
        }
    ],
    totalEstimatedCost: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Itinerary', itinerarySchema);
