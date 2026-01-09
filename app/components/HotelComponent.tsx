"use client";

import React, { useState } from "react";

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

  const [visibleCount, setVisibleCount] = useState(4);

  if (!Array.isArray(hotelList)) {
    return <p className="p-6 text-white">Loading hotels...</p>;
  }

  const visibleHotels = hotelList.slice(0, visibleCount);

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-white">Hotels</h2>

      {visibleHotels.map((hotel, index) => {
        const bgImage =
          hotel.images?.[0]?.thumbnail ||
          "https://source.unsplash.com/1600x900/?hotel";

        return (
          <section
            key={index}
            className="relative overflow-hidden rounded-3xl shadow-xl"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/20" />

            <div className="relative p-8 text-white">
              <h3 className="text-3xl font-bold mb-2">{hotel.name}</h3>

              <p className="max-w-3xl text-sm opacity-90">
                {hotel.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-blue-500/70 px-4 py-1">
                  {hotel.hotel_class} 
                </span>

                {hotel.rate_per_night?.lowest && (
                  <span className="rounded-full bg-blue-500/70 px-4 py-1">
                    From ${hotel.rate_per_night.lowest}/night
                  </span>
                )}
              </div>

              {hotel.amenities?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {hotel.amenities.slice(0, 6).map((a, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-blue-500/70 px-3 py-1 text-xs backdrop-blur-md"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {hotel.images && hotel.images.length > 1 && (
              <div className="bg-black/60 backdrop-blur-md">
                <p className="text-white text-xl p-4 font-semibold">
                  Hotel Gallery
                </p>

                <div className="flex gap-4 px-4 pb-6 overflow-x-auto scrollbar-hide">
                  {hotel.images.slice(1, 5).map((img, i) => (
                    <img
                      key={i}
                      src={img.thumbnail}
                      alt={`Hotel image ${i + 1}`}
                      className="h-40 w-64 object-cover rounded-xl shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}

      {visibleCount < hotelList.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="mt-4 rounded-full bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Load More Hotels
          </button>
        </div>
      )}
    </div>
  );
}
