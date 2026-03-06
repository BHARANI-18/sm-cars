import CarCard from "@/components/CarCard";

async function getCars() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cars`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const cars = await getCars();

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Hero */}
      <div className="text-center mb-8 mt-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
          SM Cars
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
          Browse our premium selection of vehicles. Quality, performance, and affordable prices guaranteed.
        </p>
        <a
          href="tel:9543182448"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.01 21 3 13.99 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.21 2.21z" />
          </svg>
          Call: 9543182448
        </a>
      </div>

      {cars.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">No cars currently available. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
          {cars.map((car: any) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
