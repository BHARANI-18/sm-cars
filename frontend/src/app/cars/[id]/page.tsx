import Link from "next/link";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";

async function getCar(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cars/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return null;
    }
    return res.json();
}

export default async function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const car = await getCar(id);

    if (!car) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block font-medium">
                &larr; Back to Inventory
            </Link>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 md:p-6">
                    {/* Flipkart-style Image Gallery */}
                    <ImageGallery images={car.imageUrls || []} title={car.title || "Car"} />
                </div>

                {/* Details Section */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    {car.brand && (
                        <div className="mb-2 inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {car.brand}
                        </div>
                    )}
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                        {car.title || "Untitled Car"}
                    </h1>
                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-8">
                        {car.price ? `$${car.price.toLocaleString()}` : 'Price on request'}
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-zinc-700 pb-2 mb-4">
                        Vehicle Specifications
                    </h2>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
                            <p className="font-medium text-gray-900 dark:text-white">{car.model || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
                            <p className="font-medium text-gray-900 dark:text-white">{car.year || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mileage</p>
                            <p className="font-medium text-gray-900 dark:text-white">{car.mileage ? `${car.mileage.toLocaleString()} mi` : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Transmission</p>
                            <p className="font-medium text-gray-900 dark:text-white">{car.transmission || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Fuel Type</p>
                            <p className="font-medium text-gray-900 dark:text-white">{car.fuelType || 'N/A'}</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-zinc-700 pb-2 mb-4">
                        Description
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {car.description || 'No description provided.'}
                    </p>

                </div>
            </div>
        </div>
    );
}
