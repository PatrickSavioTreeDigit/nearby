import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { getNearbyPlaces } from "../utils/places";
import { motion, AnimatePresence } from "framer-motion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const results = await getNearbyPlaces({ lat: latitude, lng: longitude });
            setPlaces(results);
          } catch (e) {
            setError("Failed to fetch nearby places.");
          }
          setLoading(false);
        },
        () => {
          setError("Location access denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setLoading(false);
    }
  }, []);

  // Color by rating for highlight box
  const getHighlightColor = (rating) => {
    if (rating > 4.8) return "#ff3b30"; // Red
    if (rating >= 4.5) return "#ff9500"; // Orange
    if (rating >= 4.0) return "#ffd60a"; // Yellow
    return "#fff"; // Neutral/white
  };

  return (
    <>
      <Head>
        <title>Nearby Party Halls/Hotels</title>
        <meta name="description" content="Find nearby party halls and hotels" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
        <main className={styles.main}>
          <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            Nearby Party Halls & Hotels
          </motion.h1>
          {loading && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>Detecting your location and fetching places...</motion.p>}
          {error && <motion.p style={{ color: "red" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
          {!loading && !error && (
            <ul style={{ listStyle: "none", padding: 0 }}>
              <AnimatePresence>
                {places.map((place, idx) => (
                  <motion.li
                    key={place.place_id}
                    className={styles.placeCard}
                    initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -30, scale: 0.95, filter: 'blur(6px)' }}
                    transition={{ duration: 0.6, delay: idx * 0.07, type: 'spring', stiffness: 80, damping: 18 }}
                    whileHover={{ scale: 1.045, boxShadow: "0 24px 56px 0 rgba(60, 60, 130, 0.22)", borderColor: '#7f9cf5', background: 'linear-gradient(135deg, #f0f4ff 60%, #e0e7ff 100%)' }}
                  >
                    <motion.span
                      className={styles.ratingHighlight}
                      style={{ background: getHighlightColor(place.rating), color: place.rating > 4.5 ? '#fff' : '#222', boxShadow: place.rating > 4.8 ? '0 0 0 4px #ff3b3022' : place.rating >= 4.5 ? '0 0 0 4px #ff950022' : place.rating >= 4.0 ? '0 0 0 4px #ffd60a22' : '0 0 0 4px #e0e7ff' }}
                      title={place.rating ? `Rating: ${place.rating}` : 'No rating'}
                      initial={{ scale: 0.7, rotate: -20, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: idx * 0.09 + 0.2, type: 'spring', stiffness: 120, damping: 10 }}
                      whileHover={{ scale: 1.15, rotate: 8 }}
                    >
                      {place.rating ? place.rating.toFixed(1) : '—'}
                    </motion.span>
                    <motion.div className={styles.placeCardContent} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: idx * 0.09 + 0.3 }}>
                      <strong>{place.name}</strong>
                      <div className={styles.address}>{place.vicinity}</div>
                      <div className={styles.distance}>
                        {place.distance
                          ? `${(place.distance / 1000).toFixed(2)} km`
                          : "-"}
                      </div>
                      <a
                        href={`/place/${place.place_id}`}
                        className={styles.neonButton}
                      >
                        View More
                      </a>
                    </motion.div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </main>
      </div>
    </>
  );
}
