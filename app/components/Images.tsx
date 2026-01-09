type Props = {
  images: any[];
  location?: string | null;
};

export default function Images({ images, location }: Props) {
  if (!images?.length) return null;
  const capFirst = location
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="mt-8 space-y-4">
      <p className="text-white text-2xl p-2 font-bold">{capFirst} Gallery</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <img
            key={img.id || i}
            src={img.thumbnail_url}
            alt={`image-${i + 1}`}
            className="w-full h-40 object-cover rounded-xl shadow-md"
          />
        ))}
      </div>
    </div>
  );
}
