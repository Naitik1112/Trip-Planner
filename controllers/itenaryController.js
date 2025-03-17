const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


exports.generateItinerary = async (req, res) => {
  try {
    const {
      fromCity,
      toCity,
      departureDate,
      guests,
      days,
      minrating,
      maxrating
    } = req.body;

    if (
      !fromCity ||
      !toCity ||
      !departureDate ||
      !guests ||
      !days ||
      !minrating ||
      !maxrating
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const prompt = `
      Generate an flight details that includes:
      - Flights (airline, departure, arrival, price)
      - DON'T USE * in the response
      - Generate only text , example : Flight XYZ at price XYZ with time XYZ
      - If specific detials are not available then give approximation
      for:
      Current Location: ${fromCity}
      Destination: ${toCity}
      Departure date: ${departureDate}
    `;

    const prompt1 = `
      Generate an Hotel details that includes:
      - Hotels (name, price, rating) with at least 3 options
      - DON'T USE * in the response
      - Generate only text , example : Hotel XYZ at price XYZ with rating XYZ
      for:
      Destination: ${toCity}
      Travellers: ${guests}
      Ratings range of Hotel: ${minrating} and ${maxrating}
    `;

    const prompt2 = `
    Generate an itinerary plan that includes:
      - Itinerary plan (day-wise activities)
      - DON'T USE * in the response
      for:
      Destination: ${toCity}
      Travellers: ${guests}
      Days: ${days}
    `;

    // Generate content using GoogleGenerativeAI SDK
    const result = await model.generateContent(prompt);
    const result1 = await model.generateContent(prompt1);
    const result2 = await model.generateContent(prompt2);

    const responseText = result.response.text();
    const responseText1 = result1.response.text();
    const responseText2 = result2.response.text();

    // console.log(responseText);
    // const final = JSON.parse(responseText);
    // console.log(final);

    res.status(200).json({
      flights: `${responseText}`,
      hotel: `${responseText1}`,
      itinerary: `${responseText2}`
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
