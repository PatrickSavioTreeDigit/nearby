// Next.js API route to fetch nearby places using Google Places API
// POST /api/places { lat, lng }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { lat, lng } = req.body;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng required' });
  }
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not set' });
  }
  const endpoint = 'https://places.googleapis.com/v1/places:searchNearby';
  const body = {
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: 1500.0
      }
    },
    includedTypes: ["restaurant", "night_club", "hotel"],
    maxResultCount: 20,
    rankPreference: "popularity"
  };
  try {
    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.location,places.id'
      },
      body: JSON.stringify(body)
    });
    const data = await apiRes.json();
    // Haversine formula to calculate distance between two lat/lng points in meters
    function getDistance(lat1, lng1, lat2, lng2) {
      const toRad = (v) => (v * Math.PI) / 180;
      const R = 6371000;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }
    if (data.places) {
      const places = data.places
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 20)
        .map(place => {
          let distance = place.distanceInMeters;
          if (!distance && place.location?.latitude && place.location?.longitude) {
            distance = getDistance(lat, lng, place.location.latitude, place.location.longitude);
          }
          return {
            name: place.displayName?.text || '',
            vicinity: place.formattedAddress || '',
            rating: place.rating || '',
            distance: distance || '',
            place_id: place.id || ''
          };
        });
      return res.status(200).json({ places });
    }
    return res.status(200).json({ places: [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch places', details: err.message });
  }
}
