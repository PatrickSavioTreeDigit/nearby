// Utility to fetch nearby party halls/hotels using Google Places API
// Usage: getNearbyPlaces({ lat, lng })



export async function getNearbyPlaces({ lat, lng }) {
  const res = await fetch('/api/places', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng })
  });
  const data = await res.json();
  return data.places || [];
}
