// Utility to fetch nearby party halls/hotels using Google Places API
// Usage: getNearbyPlaces({ lat, lng })



export async function getNearbyPlaces({ lat, lng }) {
  const apiKey = 'AIzaSyDTTLmHpb4t4mdnTDZqjLydn0peoTe5cEM'
  const endpoint = 'https://places.googleapis.com/v1/places:searchNearby';
  const body = {
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng
        },
        radius: 1500.0
      }
    },
    includedTypes:[ "restaurant", "night_club", "hotel"],
    maxResultCount: 20,
    rankPreference: "popularity"
  };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.location,places.id'
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  // Haversine formula to calculate distance between two lat/lng points in meters
  function getDistance(lat1, lng1, lat2, lng2) {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  if (data.places) {
    return data.places
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
  }
  return [];
}
