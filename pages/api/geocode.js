// /pages/api/geocode.js
// Accepts { zipcode } in POST body, returns { lat, lng } using Google Geocoding API

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { zipcode } = req.body;
  if (!zipcode) {
    return res.status(400).json({ error: 'zipcode required' });
  }
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not set' });
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(zipcode)}&region=us&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;
      return res.status(200).json({ lat: latitude, lng: longitude });
    } else {
      console.log("No results found for the given zipcode.");
      return res.status(404).json({ error: 'Zipcode not found', details: data });
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return res.status(500).json({ error: 'Failed to geocode', details: error.message });
  }
}
