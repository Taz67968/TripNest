type Props = {
  days: any[];
};

export default function DailyForecast({ days }: Props) {
  return (
    <section className="w-full bg-slate-900/90 backdrop-blur rounded-2xl p-5">
      <h2 className="text-sm font-semibold tracking-wide text-slate-400 mb-4">
        6-DAY FORECAST
      </h2>

      {/* Mobile: stacked | Desktop: grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {days.map((day) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });

          return (
            <div
              key={day.date}
              className="flex flex-col items-center justify-between
                         bg-slate-800/60 rounded-xl p-4
                         hover:bg-slate-700/60 transition"
            >
              {/* Day */}
              <p className="text-sm font-medium text-slate-300">
                {dayName}
              </p>

              {/* Icon */}
              <img
                src={`https:${day.day.condition.icon}`}
                alt={day.day.condition.text}
                className="w-12 h-12 my-2"
              />

              {/* Condition */}
              <p className="text-xs text-slate-400 text-center">
                {day.day.condition.text}
              </p>

              {/* Temp */}
              <p className="mt-2 text-lg font-semibold text-white">
                {Math.round(day.day.avgtemp_c)}°
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
