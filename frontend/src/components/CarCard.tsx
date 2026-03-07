import Image from "next/image";
import Link from "next/link";

interface Car {
    _id: string;
    title: string;
    brand: string;
    model: string;
    year: number;
    price: string;
    fuelType: string | string[];
    transmission: string;
    mileage: number;
    kilometer: number;
    imageUrls: string[];
}

// Parse fuelType regardless of whether it's a comma-string or array
function getFuelTypes(fuelType: string | string[] | undefined): string[] {
    if (!fuelType) return [];
    if (Array.isArray(fuelType)) return fuelType;
    return fuelType.split(',').map(s => s.trim()).filter(Boolean);
}

export default function CarCard({ car }: { car: Car }) {
    const fuelTypes = getFuelTypes(car.fuelType);

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-52 w-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                {car.imageUrls && car.imageUrls.length > 0 ? (
                    <Image
                        src={car.imageUrls[0]}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                )}
                <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-sm font-extrabold shadow-lg z-10">
                    {car.price ? `₹${car.price}` : 'POA'}
                </div>
            </div>

            <div className="p-4">
                {/* Car name */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
                    {car.brand} {car.model}
                </h3>

                {/* Quick specs */}
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 gap-2 flex-wrap">
                    {car.year && <span>{car.year}</span>}
                    {car.kilometer != null && car.kilometer > 0 && (
                        <><span>·</span><span>{car.kilometer.toLocaleString()} km</span></>
                    )}
                    {car.transmission && (
                        <><span>·</span><span>{car.transmission}</span></>
                    )}
                </div>

                {/* Fuel type badges */}
                {fuelTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {fuelTypes.map(ft => (
                            <span
                                key={ft}
                                className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            >
                                {ft}
                            </span>
                        ))}
                    </div>
                )}

                <Link
                    href={`/cars/${car._id}`}
                    className="block w-full text-center bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-600 hover:to-indigo-600 dark:from-zinc-800 dark:to-zinc-800 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-gray-900 hover:text-white dark:text-gray-100 font-bold py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
