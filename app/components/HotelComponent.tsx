"use client";

import React, { useState, useEffect } from "react";

type Image = {
  thumbnail: string;
};

type Rate = {
  lowest: number;
};

type Property = {
  name: string;
  description: string;
  hotel_class: string;
  images: Image[];
  rate_per_night: Rate;
  amenities: string[];
};

type Props = {
  properties?: Property[] | { properties: Property[] };
};

export default function Hotel({ properties }: Props) {
  const hotelList = Array.isArray(properties)
    ? properties
    : properties?.properties;

  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (!hotelList || hotelList.length === 0) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % hotelList.length);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + hotelList.length) % hotelList.length);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [hotelList]);

  if (!Array.isArray(hotelList) || hotelList.length === 0) {
    return <p className="p-6 text-white">Loading hotels...</p>;
  }

  const next = () => setIndex((i) => (i + 1) % hotelList.length);
  const prev = () => setIndex((i) => (i - 1 + hotelList.length) % hotelList.length);

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.touches[0].clientX);
  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const delta = touchStart - touchEnd;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Hotels</h2>

      <div className="relative">
        <div className="overflow-hidden rounded-3xl shadow-xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {hotelList.map((hotel, i) => {
              const bgImage =
                hotel.images?.[0]?.thumbnail ||
                'https://source.unsplash.com/1600x900/?hotel';

              return (
                <div
                  key={i}
                  className="min-w-full flex-shrink-0 relative"
                  style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-overlay" />

                  <div className="relative p-8 text-white min-h-[220px]">
                    <h3 className="text-3xl font-bold mb-2">{hotel.name}</h3>
                    <p className="max-w-3xl text-sm opacity-90">{hotel.description}</p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full badge-primary px-4 py-1">{hotel.hotel_class}</span>

                      {hotel.rate_per_night?.lowest && (
                        <span className="rounded-full badge-primary px-4 py-1">From ${hotel.rate_per_night.lowest}/night</span>
                      )}
                    </div>

                    {hotel.amenities?.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {hotel.amenities.slice(0, 6).map((a, i2) => (
                          <span key={i2} className="rounded-full badge-primary px-3 py-1 text-xs backdrop-blur-md">{a}</span> 
                        ))}
                      </div>
                    )}
                  </div>

                  {hotel.images && hotel.images.length > 1 && (
                    <div className="bg-glass backdrop-blur-md">
                      <p className="text-white text-xl p-4 font-semibold">Hotel Gallery</p>

                      <div className="flex gap-4 px-4 pb-6 overflow-x-auto scrollbar-hide">
                        {hotel.images.slice(1, 5).map((img, i3) => (
                          <img key={i3} src={img.thumbnail} alt={`Hotel image ${i3 + 1}`} className="h-40 w-64 object-cover rounded-xl shrink-0" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {hotelList.length > 1 && (
          <>
            <button onClick={prev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 btn-ghost text-white rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={next} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 btn-ghost text-white rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>

            <div className="flex items-center justify-center gap-2 mt-4">
              {hotelList.map((_, dotIdx) => (
                <button key={dotIdx} onClick={() => setIndex(dotIdx)} className={`h-2 w-8 rounded-full ${dotIdx === index ? 'dot-active' : 'dot-inactive'}`} aria-label={`Go to slide ${dotIdx + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
