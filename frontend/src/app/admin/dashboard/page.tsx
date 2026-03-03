"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getCars, deleteCar, createCar, updateCar } from "@/lib/api";
import Image from "next/image";

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [cars, setCars] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<any>(null); // null if adding new
    const [formLoading, setFormLoading] = useState(false);

    // Modal State
    const [formData, setFormData] = useState({
        title: "", brand: "", model: "", year: "", price: "", fuelType: "", transmission: "", mileage: "", description: ""
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/admin/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const data = await getCars();
            setCars(data);
        } catch (error) {
            console.error(error);
        } finally {
            setDataLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this car?")) {
            try {
                await deleteCar(id);
                fetchCars();
            } catch (error) {
                alert("Failed to delete car");
            }
        }
    };

    const openAddModal = () => {
        setEditingCar(null);
        setFormData({ title: "", brand: "", model: "", year: "", price: "", fuelType: "", transmission: "", mileage: "", description: "" });
        setImageFiles([]);
        setPrimaryImageIndex(0);
        setIsModalOpen(true);
    };

    const openEditModal = (car: any) => {
        setEditingCar(car);
        setFormData({
            title: car.title || "", brand: car.brand || "", model: car.model || "", year: car.year ? car.year.toString() : "", price: car.price ? car.price.toString() : "",
            fuelType: car.fuelType || "", transmission: car.transmission || "", mileage: car.mileage ? car.mileage.toString() : "", description: car.description || ""
        });
        setImageFiles([]);
        setPrimaryImageIndex(0);
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(Array.from(e.target.files));
            setPrimaryImageIndex(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        const sendData = new FormData();
        Object.entries(formData).forEach(([key, value]) => sendData.append(key, value));

        if (imageFiles && imageFiles.length > 0) {
            // Re-order so the selected primary image is uploaded first (index 0)
            const orderedFiles = [...imageFiles];
            if (primaryImageIndex > 0 && primaryImageIndex < orderedFiles.length) {
                const primary = orderedFiles.splice(primaryImageIndex, 1)[0];
                orderedFiles.unshift(primary);
            }

            orderedFiles.forEach(file => {
                if (file instanceof File) {
                    sendData.append('images', file);
                }
            });
        }

        try {
            if (editingCar) {
                await updateCar(editingCar._id, sendData);
            } else {
                await createCar(sendData);
            }
            setIsModalOpen(false);
            fetchCars();
        } catch (error: any) {
            console.error("Save error:", error);
            const errorMsg = error.response?.data?.message || error.message || "Failed to save car data.";
            alert(`Error: ${errorMsg}`);
        } finally {
            setFormLoading(false);
        }
    };

    // Block ALL rendering until auth check is complete
    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <button
                    onClick={openAddModal}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-md"
                >
                    + Add New Car
                </button>
            </div>

            {/* Cars Data Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden">
                {dataLoading ? (
                    <p className="p-8 text-center text-gray-500">Loading inventory...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
                                    <th className="p-4 font-semibold text-sm uppercase">Image</th>
                                    <th className="p-4 font-semibold text-sm uppercase">Title</th>
                                    <th className="p-4 font-semibold text-sm uppercase">Price</th>
                                    <th className="p-4 font-semibold text-sm uppercase">Year</th>
                                    <th className="p-4 font-semibold text-sm uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                {cars.map((car) => (
                                    <tr key={car._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                                        <td className="p-4">
                                            <div className="relative w-20 h-14 rounded-md overflow-hidden bg-gray-200">
                                                <Image src={car.imageUrls?.[0] || "https://via.placeholder.com/80"} alt={car.title} fill className="object-cover" sizes="80px" />
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900 dark:text-white">{car.title || "Untitled Car"}</td>
                                        <td className="p-4 text-blue-600 dark:text-blue-400 font-semibold">
                                            {car.price ? `$${car.price.toLocaleString()}` : 'N/A'}
                                        </td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400">{car.year || 'N/A'}</td>
                                        <td className="p-4 text-right space-x-3">
                                            <button onClick={() => openEditModal(car)} className="text-blue-500 hover:text-blue-600 font-medium font-sm transition">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(car._id)} className="text-red-500 hover:text-red-600 font-medium font-sm transition">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {cars.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">No cars found. Add one!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {editingCar ? "Edit Car" : "Add New Car"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-3xl font-light">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                                    <input name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand</label>
                                    <input name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
                                    <input name="model" value={formData.model} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mileage</label>
                                    <input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fuel Type</label>
                                    <select name="fuelType" value={formData.fuelType} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white">
                                        <option value="">Select...</option>
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transmission</label>
                                    <select name="transmission" value={formData.transmission} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white">
                                        <option value="">Select...</option>
                                        <option value="Automatic">Automatic</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                    <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Upload Images {editingCar && "(Leave empty to keep current images)"}
                                    </label>
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />

                                    {imageFiles.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select the primary image to display on the front page:</p>
                                            <div className="flex gap-3 overflow-x-auto pb-2">
                                                {imageFiles.map((file, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setPrimaryImageIndex(idx)}
                                                        className={`relative w-24 h-24 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${primaryImageIndex === idx ? 'border-blue-500 shadow-md scale-105' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                                                    >
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`preview-${idx}`}
                                                            className="object-cover w-full h-full"
                                                        />
                                                        {primaryImageIndex === idx && (
                                                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                                                                COVER
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-zinc-800 gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                                    Cancel
                                </button>
                                <button type="submit" disabled={formLoading} className={`px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition ${formLoading ? "opacity-70 cursor-not-allowed" : ""}`}>
                                    {formLoading ? "Saving..." : "Save Car"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
