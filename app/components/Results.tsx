"use client";

import React, { useEffect, useState } from "react";
import DailyForecast from "./Weather";
import HourlyForecast from "./TimeForecast";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Convertor from "./Converter";
import Hotel from "./HotelComponent";
import Images from "./Images";

type Activity = {
  title: string;
  activity: string;
};

export default function Results() {
  const [hotel, setHotel] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [query, setQuery] = useState<string | null>(null);
  const [country, setCountry] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [toCurrency, setToCurrency] = useState<string>("");
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [imageError, setImageError] = useState("");
  const [hotelError, setHotelError] = useState("");
  const [weatherError, setWeatherError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [activityError, setActivityError] = useState("");

  const router = useRouter();
  useEffect(() => {
    const stored = localStorage.getItem("search");
    if (stored) setQuery(stored);
  }, []);

  useEffect(() => {
    if (!query) return;

    const fetchWeather = async () => {
      try {
        setLoadingWeather(true);
        setWeatherError("");

        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        if (!apiKey) throw new Error("Missing weather API key");

        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=7&aqi=no&alerts=no`
        );

        if (!res.ok) throw new Error("Weather fetch failed");

        const data = await res.json();
        setWeather(data);
      } catch {
        setWeatherError("Failed to fetch weather data");
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [query]);

  useEffect(() => {
    if (!country) return;

    const fetchActivities = async () => {
      try {
        setLoadingActivities(true);
        setActivityError("");

        const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
        if (!apiKey) throw new Error("Missing RapidAPI key");

        const res = await fetch(
          `https://travel-info-api.p.rapidapi.com/country-activities?country=${country?.name?.common}`,
          {
            headers: {
              "X-RapidAPI-Key": apiKey,
              "X-RapidAPI-Host": "travel-info-api.p.rapidapi.com",
            },
          }
        );

        if (!res.ok) throw new Error("Activities fetch failed");

        const data = await res.json();
       setActivities(
  Array.isArray(data?.data?.activities)
    ? data.data.activities
    : []
);

      } catch {
        setActivityError("Failed to fetch activities data");
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchActivities();
  }, [country]);

  useEffect(() => {
    if (!query) return;

    const fetchHotels = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

        if (!apiKey) {
          throw new Error("Missing RapidAPI key");
        }

        const res = await fetch(
          `https://hoteldiscoveryapi.p.rapidapi.com/api/hotels/destination/search?destination=${query}&q=${query}%20Hotels`,
          {
            headers: {
              "X-RapidAPI-Key": apiKey,
              "X-RapidAPI-Host": "hoteldiscoveryapi.p.rapidapi.com",
            },
          }
        );

        if (!res.ok) throw new Error("Hotels fetch failed");

        const data = await res.json();
        setHotel(data);
      } catch (err) {
        setHotelError("Failed to fetch hotels data");
      } finally {
        setLoadingHotels(false);
      }
    };

    fetchHotels();
  }, [query]);

  useEffect(() => {
    if (!query) return;

    const fetchCountry = async () => {
      try {
        setLoadingCountry(true);
        setCountryError("");

        const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);
        if (res.ok) {
          const data = await res.json();
          setCountry(data[0]);
          return;
        }

        const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
        if (!apiKey) throw new Error("Missing RapidAPI key");

        const cityRes = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=1`,
          {
            headers: {
              "X-RapidAPI-Key": apiKey,
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );

        const cityData = await cityRes.json();
        if (!cityData.data?.length) throw new Error();

        const code = cityData.data[0].countryCode;
        const countryRes = await fetch(
          `https://restcountries.com/v3.1/alpha/${code}`
        );

        const countryData = await countryRes.json();
        setCountry(countryData[0]);
        setToCurrency(
          countryData[0].currencies
            ? Object.keys(countryData[0].currencies)[0]
            : ""
        );
      } catch {
        setCountryError("Failed to fetch country data");
      } finally {
        setLoadingCountry(false);
      }
    };

    fetchCountry();
  }, [query]);

  useEffect(() => {
    if (!query) return;

    const fetchImages = async () => {
      try {
        setLoadingImages(true);

        const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
        if (!apiKey) throw new Error("Missing RapidAPI key");

        const res = await fetch(
          `https://real-time-image-search.p.rapidapi.com/search?query=${query}&limit=20&safe_search=off&type=photo&region=us`,
          {
            headers: {
              "X-RapidAPI-Key": apiKey,
              "X-RapidAPI-Host": "real-time-image-search.p.rapidapi.com",
            },
          }
        );

        if (!res.ok) throw new Error("Image fetch failed");

        const data = await res.json();
        setImages(data.data);
      } catch (err) {
        setImageError("Failed to fetch images");
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImages();
  }, [query]);

  if (loadingCountry && loadingWeather) {
    return <p className="p-6">Loading...</p>;
  }

  const currencies = country?.currencies
    ? Object.values(country.currencies)
    : [];

  if (!country || !weather) {
    return <p className="p-6">Loading...</p>;
  }

  const currentHour = new Date(weather.location.localtime).getHours();
  const todayHours = weather.forecast.forecastday[0].hour
    .slice(currentHour)
    .slice(0, 9);

  const nextDays = weather.forecast.forecastday.slice(1, 7);

  const isRain = weather.current.condition.text.toLowerCase().includes("rain");

  const back = () => {
    router.back();
  };
  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      <div className="flex" onClick={back}>
        <ChevronLeft />
        <p>Back</p>
      </div>
      <div className="rounded-3xl p-8 shadow-xl bg-gray-900/80">
        {loadingCountry && <p>Loading country info...</p>}
        {countryError && <p className="text-red-400">{countryError}</p>}
        {!loadingCountry && !countryError && country && (
          <>
            <h1 className="text-2xl font-bold mb-4">COUNTRY INFO:</h1>
            <div className="flex  justify-evenly flex-col md:flex-row gap-8 items-center p-6 rounded-3xl text-white">
              <div className="">
                <img
                  src={country.flags.png}
                  alt={country.name.common}
                  className="w-32 rounded shadow"
                />
                <p>
                  <strong>Region:</strong> {country.region}
                </p>
              </div>

              <div>
                <h1 className="text-4xl font-bold">{country.name.common}</h1>
                <p>
                  <strong>Capital:</strong> {country.capital?.join(", ")}
                </p>
              </div>
              <div>
                <p>
                  <strong>Languages:</strong>{" "}
                  {Object.values(country.languages || {}).join(", ")}
                </p>

                <div className="mt-2">
                  <strong>Currency:</strong>
                  {currencies.map((c: any, i: number) => (
                    <p key={i}>
                      {c.name} ({c.symbol})
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <Convertor toCurrency={toCurrency} />
          </>
        )}
      </div>

      <div
        className={`rounded-3xl p-8 text-white shadow-xl ${
          isRain
            ? "bg-linear-to-br from-slate-600 to-slate-800"
            : "bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600"
        }`}
      >
        {loadingWeather && <p>Loading weather...</p>}
        {weatherError && <p className="text-red-200">{weatherError}</p>}

        {!loadingWeather && !weatherError && weather && (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold">
                  {weather.location.name}
                </h2>
                <p className="text-sm opacity-80">
                  {new Date(weather.location.localtime).toLocaleDateString(
                    undefined,
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              <img
                src={`https:${weather.current.condition.icon}`}
                alt={weather.current.condition.text}
                className="w-20 h-20"
              />
            </div>

            <div className="mt-6">
              <p className="text-6xl md:text-7xl font-bold">
                {weather.current.temp_c}°
              </p>
              <p className="capitalize opacity-90">
                {weather.current.condition.text}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-10">
              <div className="bg-white/10 rounded-xl p-4">
                ☔ Rain
                <p className="text-lg font-semibold">
                  {weather.forecast.forecastday[0].day.daily_chance_of_rain}%
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                🌡 Feels Like
                <p className="text-lg font-semibold">
                  {weather.current.feelslike_c}°C
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                💨 Wind
                <p className="text-lg font-semibold">
                  {weather.current.wind_kph} km/h
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                💧 Humidity
                <p className="text-lg font-semibold">
                  {weather.current.humidity}%
                </p>
              </div>
            </div>
            <div className="space-y-8 mb-5">
              <HourlyForecast
                hours={todayHours}
                currentTime={weather.location.localtime}
              />
            </div>
            <DailyForecast days={nextDays} />
          </>
        )}
      </div>
      <div className="">
        {loadingHotels && <p>Loading hotels...</p>}
        {hotelError && <p className="text-red-400">{hotelError}</p>}
        {!loadingHotels && !hotelError && (
          <Hotel properties={hotel?.properties} />
        )}
      </div>
      <div>
        {!loadingActivities && !activityError && activities.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="bg-white/10 p-6 rounded-xl text-white"
              >
                <h2 className="text-xl font-semibold mb-2">{activity.title}</h2>
                <p className="text-sm opacity-90">{activity.activity}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <section>
        {loadingImages && <p>Loading images...</p>}
        {imageError && <p className="text-red-400">{imageError}</p>}
        {!loadingImages && !imageError && (
          <Images images={images} location={query} />
        )}
      </section>
    </div>
  );
}
