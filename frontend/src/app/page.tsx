import CarCard from "@/components/CarCard";

// Using native fetch with revalidate to ensure SSG or fresh data
async function getCars() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cars`, {
    cache: "no-store", // disable caching to always show latest cars on Home Page
  });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function Home() {
  const cars = await getCars();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Find Your Dream Car
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse our premium selection of vehicles. Quality, performance, and affordable prices guaranteed.
        </p>
      </div>

      {cars.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">No cars currently available. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cars.map((car: any) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
