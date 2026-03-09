import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateAIPlan = async ({
    destination,
    startDate,
    endDate,
    budget,
    interests,
    travelers,
    weatherData
}) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.log('Using mock AI data (no API key provided)');
        return getMockItinerary({ destination, startDate, endDate });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Using "gemini-flash-latest" as it is the only model with available quota for this key
        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest'
        });

        const prompt = `
You are a professional travel planner. Create a detailed, day-by-day travel itinerary for ${destination} from ${startDate} to ${endDate}.
The user has a ${budget} budget, is bringing ${travelers} traveler(s), and is interested in: ${interests.join(', ')}.

Here is some weather context for the destination:
${JSON.stringify(weatherData)}

Return ONLY a valid JSON object.
JSON Structure:
{
  "totalEstimatedCost": number,
  "days": [
    {
      "day": number,
      "date": "YYYY-MM-DD",
      "weather": { "condition": string, "temp": number },
      "activities": [
        {
          "time": "HH:MM AM/PM",
          "title": string,
          "description": string,
          "location": { "lat": number, "lng": number },
          "cost": number
        }
      ]
    }
  ]
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the text in case it has markdown blocks (Gemini models often include them)
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error('Error with Gemini API (gemini-flash-latest):', error.message);
        console.log('Falling back to mock data as a last resort.');
        return getMockItinerary({ destination, startDate, endDate });
    }
};

const getMockItinerary = ({ destination, startDate, endDate }) => {
    return {
        totalEstimatedCost: 1500,
        days: [
            {
                day: 1,
                date: new Date(startDate).toISOString().split('T')[0],
                weather: { condition: 'Sunny', temp: 22, icon: '☀️' },
                activities: [
                    {
                        time: '10:00 AM',
                        title: `Explore Downtown ${destination}`,
                        description: 'Walk around the city center and enjoy local cafes.',
                        location: { lat: 40.7128, lng: -74.006 },
                        cost: 20
                    }
                ]
            }
        ]
    };
};
