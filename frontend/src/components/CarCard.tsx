import Image from "next/image";
import Link from "next/link";

interface Car {
    _id: string;
    title: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    fuelType: string;
    transmission: string;
    mileage: number;
    imageUrls: string[];
}

export default function CarCard({ car }: { car: Car }) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-56 w-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                {car.imageUrls && car.imageUrls.length > 0 ? (
                    <Image
                        src={car.imageUrls[0]}
                        alt={car.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <span className="text-gray-400">No image available</span>
                )}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    ${car.price?.toLocaleString() || "0"}
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                        {car.title || "Untitled"}
                    </h3>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 space-x-2">
                    <span>{car.year || 'N/A'}</span>
                    <span>&bull;</span>
                    <span>{car.mileage ? car.mileage.toLocaleString() : 'N/A'} mi</span>
                    <span>&bull;</span>
                    <span>{car.transmission || 'N/A'}</span>
                </div>

                <Link
                    href={`/cars/${car._id}`}
                    className="block w-full text-center bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
