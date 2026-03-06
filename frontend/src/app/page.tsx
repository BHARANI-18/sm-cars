import Image from "next/image";
import Link from "next/link";
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
    <div>
      {/* ── Hero Section ── */}
      <section className="relative bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-10 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0">
            {/* Left: text */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight">
                SM <span className="text-blue-400">Cars</span>
              </h1>
              <p className="text-gray-300 text-base md:text-lg mb-6 max-w-md mx-auto md:mx-0">
                Premium pre-owned vehicles. Quality, performance &amp; affordable prices — right here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <a
                  href="tel:9543182448"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-green-900/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.01 21 3 13.99 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.21 2.21z" />
                  </svg>
                  Call: 9543182448
                </a>
                <Link
                  href="#inventory"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition border border-white/20"
                >
                  View Inventory →
                </Link>
              </div>
            </div>

            {/* Right: hero car image */}
            <div className="flex-1 relative flex items-center justify-center">
              <div className="relative w-full max-w-sm md:max-w-lg">
                {/* Glow behind car */}
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl scale-110" />
                <Image
                  src="/hero_car.png"
                  alt="Premium Car"
                  width={600}
                  height={340}
                  className="relative z-10 w-full h-auto object-contain drop-shadow-2xl mix-blend-screen"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-zinc-950 to-transparent" />
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex justify-around text-center">
          <div>
            <p className="text-2xl font-extrabold text-blue-600">{cars.length}+</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cars Available</p>
          </div>
          <div className="border-l border-gray-200 dark:border-zinc-700 pl-6">
            <p className="text-2xl font-extrabold text-blue-600">100%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Verified Stock</p>
          </div>
          <div className="border-l border-gray-200 dark:border-zinc-700 pl-6">
            <p className="text-2xl font-extrabold text-blue-600">💬</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Easy Finance</p>
          </div>
        </div>
      </section>

      {/* ── Inventory ── */}
      <section id="inventory" className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Our Inventory</h2>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">
            {cars.length} cars
          </span>
        </div>

        {/* Silhouette banner — decorative */}
        <div className="relative mb-8 hidden md:block">
          <Image
            src="/car_silhouette_banner.png"
            alt="Car types"
            width={1200}
            height={120}
            className="w-full h-20 object-contain opacity-10 dark:opacity-20"
          />
        </div>

        {cars.length === 0 ? (
          <div className="text-center text-gray-500 mt-16 py-12">
            <Image
              src="/hero_car_front.png"
              alt="No cars"
              width={300}
              height={200}
              className="mx-auto mb-6 opacity-40"
            />
            <p className="text-xl font-medium">No cars currently available.</p>
            <p className="text-sm mt-2">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
            {cars.map((car: any) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
