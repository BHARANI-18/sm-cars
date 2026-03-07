import Link from "next/link";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";

async function getCar(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cars/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const car = await getCar(id);
    if (!car) notFound();

    const fuelDisplay = Array.isArray(car.fuelType)
        ? car.fuelType.join(' / ')
        : car.fuelType
            ? car.fuelType.split(',').map((s: string) => s.trim()).join(' / ')
            : 'N/A';

    return (
        <div className="container mx-auto px-4 py-6">
            <Link href="/" className="text-blue-500 hover:underline mb-4 inline-flex items-center gap-1 font-medium text-sm">
                ← Back to Inventory
            </Link>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">
                {/* Image Gallery */}
                <div className="p-3 md:p-6">
                    <ImageGallery images={car.imageUrls || []} title={`${car.brand || ''} ${car.model || ''}`} />
                </div>

                {/* Details */}
                <div className="px-4 pb-8 md:px-10 md:pb-12">
                    {/* Brand badge */}
                    {car.brand && (
                        <div className="mb-2 inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {car.brand}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {car.brand} {car.model}
                    </h1>

                    {/* Price */}
                    <p className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-6 drop-shadow-sm">
                        {car.price ? `₹${car.price}` : 'Price on request'}
                    </p>

                    {/* CTA - Call button (mobile prominent) */}
                    <a
                        href="tel:9543182448"
                        className="flex items-center justify-center gap-2 w-full md:w-auto md:inline-flex bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 px-6 rounded-xl text-base mb-8 transition shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.01 21 3 13.99 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.21 2.21z" />
                        </svg>
                        Call: 9543182448
                    </a>

                    {/* Specs */}
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-zinc-700 pb-2 mb-4">
                        Vehicle Specifications
                    </h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-8">
                        <SpecItem label="Model" value={car.model} />
                        <SpecItem label="Year" value={car.year} />
                        <SpecItem label="Mileage" value={car.mileage ? `${car.mileage.toLocaleString()} mi` : undefined} />
                        <SpecItem label="Transmission" value={car.transmission} />
                        <SpecItem label="Fuel Type" value={fuelDisplay} />
                        <SpecItem label="Kilometer" value={car.kilometer ? `${car.kilometer.toLocaleString()} km` : undefined} />
                        <SpecItem label="Owner" value={car.owner} />
                        <SpecItem label="FC Until" value={car.fcUntil} />
                        <SpecItem label="Insurance" value={car.insurance} />
                    </div>

                    {/* Description */}
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-zinc-700 pb-2 mb-4">
                        Description
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                        {car.description || 'No description provided.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

function SpecItem({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
            <p className="font-medium text-gray-900 dark:text-white text-sm">{value || 'N/A'}</p>
        </div>
    );
}
