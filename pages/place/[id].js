

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
import { FaPhoneAlt, FaStar, FaRegStar, FaStarHalfAlt, FaClock } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

export default function PlaceDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    async function fetchDetails() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDTTLmHpb4t4mdnTDZqjLydn0peoTe5cEM';
        const endpoint = `https://places.googleapis.com/v1/places/${id}?fields=displayName,formattedAddress,photos,rating,userRatingCount,internationalPhoneNumber,editorialSummary,location,types,googleMapsUri,adrFormatAddress,regularOpeningHours,servesBeer,servesWine,servesBreakfast,servesLunch,servesDinner,servesVegetarianFood,priceLevel&key=${apiKey}`;
        const res = await fetch(endpoint);
        const data = await res.json();
        setPlace(data);
      } catch (e) {
        setError('Failed to fetch place details.');
      }
      setLoading(false);
    }
    fetchDetails();
  }, [id]);

  // Carousel logic
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselRef = useRef(null);
  const photos = place?.photos || [];
  const totalPhotos = photos.length;

  const nextPhoto = () => setCarouselIdx((i) => (i + 1) % totalPhotos);
  const prevPhoto = () => setCarouselIdx((i) => (i - 1 + totalPhotos) % totalPhotos);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #050510 0%, #10101a 60%, #1e3a8a 90%, #2563eb 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradientMove 8s ease-in-out infinite',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 0 40px 0',
    }}>
      <Head>
        <title>Place Details</title>
      </Head>
      <main className={styles.main} style={{ width: '100%', maxWidth: 420, margin: '0 auto', padding: '0 0 24px 0' }}>
        <AnimatePresence>
          {loading && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{textAlign:'center',fontWeight:600,color:'#fff'}}>Loading...</motion.p>}
          {error && <motion.p style={{ color: '#ff3b30', textAlign:'center', fontWeight:700 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{error}</motion.p>}
          {place && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 80, damping: 16 }}
              style={{
                background: 'rgba(20,24,40,0.97)',
                borderRadius: 20,
                padding: 18,
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                margin: '0 auto',
                marginTop: 18,
                color: '#fff',
                width: '100%',
                maxWidth: 420,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} style={{ marginBottom: 12, fontWeight: 800, fontSize: '1.4em', textAlign: 'center', background: 'linear-gradient(90deg, #fff 30%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textFillColor: 'transparent' }}>{place.displayName?.text}</motion.h2>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} style={{ color: '#60a5fa', fontWeight: 600, marginBottom: 8, textAlign: 'center', fontSize: '1.08em' }}>{place.formattedAddress}</motion.div>
              {totalPhotos > 0 && (
                <motion.div
                  ref={carouselRef}
                  style={{ width: '100%', maxWidth: 360, margin: '0 auto 18px auto', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '66%', overflow: 'hidden', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
                    <AnimatePresence initial={false} mode="wait">
                      <motion.img
                        key={carouselIdx}
                        src={`https://places.googleapis.com/v1/${photos[carouselIdx].name}/media?maxWidthPx=600&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDTTLmHpb4t4mdnTDZqjLydn0peoTe5cEM'}`}
                        alt={place.displayName?.text}
                        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14, left: 0, top: 0 }}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5 }}
                      />
                    </AnimatePresence>
                  </div>
                  {totalPhotos > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 10 }}>
                      <button onClick={prevPhoto} style={{ background: 'rgba(30,58,138,0.8)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: '1em', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}>&lt;</button>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '1em' }}>{carouselIdx + 1} / {totalPhotos}</span>
                      <button onClick={nextPhoto} style={{ background: 'rgba(30,58,138,0.8)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: '1em', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}>&gt;</button>
                    </div>
                  )}
                </motion.div>
              )}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }} style={{ marginBottom: 8, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '1.25em', color: '#ffd60a' }}>
                  {(() => {
                    const stars = [];
                    const rating = place.rating || 0;
                    for (let i = 1; i <= 5; i++) {
                      if (rating >= i) stars.push(<FaStar key={i} />);
                      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} />);
                      else stars.push(<FaRegStar key={i} />);
                    }
                    return stars;
                  })()}
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95em', marginLeft: 6 }}>{place.rating || 'N/A'}</span>
                </span>
                <span style={{ color: '#e0e7ff', fontWeight: 500, fontSize: '0.97em' }}>({place.userRatingCount || 0} reviews)</span>
              </motion.div>
              {place.editorialSummary && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }} style={{ marginBottom: 8, color: '#e0e7ff', textAlign: 'center' }}>{place.editorialSummary.text}</motion.div>}
              {place.internationalPhoneNumber && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }} style={{ marginBottom: 8, color: '#fff', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <FaPhoneAlt style={{ color: '#60a5fa', fontSize: '1.1em' }} />
                  <span style={{ fontWeight: 600 }}>{place.internationalPhoneNumber}</span>
                </motion.div>
              )}
              {/* {place.regularOpeningHours && place.regularOpeningHours.weekdayDescriptions && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }} style={{ marginBottom: 8, color: '#fff', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#60a5fa', fontSize: '1.08em', marginBottom: 4 }}><FaClock /> Hours</span>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 2,
                    background: 'linear-gradient(90deg, #10101a 60%, #1e3a8a 100%)',
                    borderRadius: 10,
                    padding: '8px 12px',
                    width: '100%',
                    maxWidth: 260,
                    boxShadow: '0 1.5px 6px rgba(42,124,255,0.07)',
                  }}>
                    {place.regularOpeningHours.weekdayDescriptions.map((desc, i) => (
                      <span key={i} style={{ color: '#e0e7ff', fontWeight: 500, fontSize: '0.98em', textAlign: 'left', letterSpacing: '0.01em' }}>{desc}</span>
                    ))}
                  </div>
                </motion.div>
              )} */}
              {place.googleMapsUri && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }} style={{ marginBottom: 8, textAlign: 'center' }}><a href={place.googleMapsUri} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontWeight: 700 }}>View on Google Maps</a></motion.div>}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <style jsx global>{`
        @media (max-width: 600px) {
          .${styles.main} {
            padding: 0 0 24px 0 !important;
            max-width: 98vw !important;
          }
        }
      `}</style>
    </div>
  );
}
