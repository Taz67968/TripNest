'use client'
import SearchBar from "@/app/components/SearchBar";
import { useState, useEffect } from "react";

const images = [
  "/hero1.jpeg",
  "/hero.jpeg",
  "/hero2.jpeg",
  "/hero3.jpg",
  "/hero4.jpg",
  "/hero5.jpg",
  "/hero6.jpg",
  "/hero7.jpg",
  "/hero8.jpg",
  "/hero9.jpg",
];

export default function Home() {
  const [bg, setBg] = useState(images[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      setBg(images[Math.floor(Math.random() * images.length)]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <section
      className="relative min-h-screen w-full flex items-center justify-center bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
    >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-blue-500 px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Your Personal Guide to Every Destination
          </h1>
          <p className="text-lg md:text-xl">
            Everything you need for your next adventure — in one place.
          </p>
          <SearchBar/>
        </div>
      </section>
    </>
  );
}
