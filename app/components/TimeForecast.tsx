import { Droplets } from "lucide-react";

type Props = {
  hours: any[];
  currentTime: string;
};

export default function HourlyForecast({ hours, currentTime }: Props) {
  const now = new Date(currentTime).getHours();

  const nextHours = hours
    .filter((hour) => new Date(hour.time).getHours() >= now)
    .slice(0, 9);

  return (
    <div className="w-full bg-white/10 backdrop-blur rounded-2xl p-6 shadow-md">
      <h2 className="text-sm font-semibold text-white/80 mb-4 tracking-wide">
        TODAY’S FORECAST
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {nextHours.map((hour) => (
          <div
            key={hour.time}
            className="flex flex-col items-center min-w-29 bg-white/10 rounded-xl p-4 text-white text-center transition hover:bg-white/20"
          >
            
            <p className="text-xs opacity-80">
              {hour.time.split(" ")[1]}
            </p>

      
            <img
              src={`https:${hour.condition.icon}`}
              alt={hour.condition.text}
              className="w-10 h-10 my-2"
            />

          
            <p className="font-semibold text-lg">
              {hour.temp_c}°
            </p>

            
            <p className="text-xs text-blue-200 mt-1 flex gap-2">
               <Droplets size={15}/>{hour.chance_of_rain}%
            </p>
          </div> 
        ))}
      </div>
    </div>
  );
}
