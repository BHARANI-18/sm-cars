"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getCars, deleteCar, createCar, updateCar } from "@/lib/api";
import { compressImages } from "@/lib/imageUtils";
import Image from "next/image";

const FUEL_OPTIONS = ['Petrol', 'Diesel', 'LPG', 'CNG', 'Electric'];

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [cars, setCars] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    // Add/Edit modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");

    // Custom dialog modals (no browser alert/confirm)
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; message: string; onConfirm: () => void }>(
        { open: false, message: "", onConfirm: () => { } }
    );
    const [notifModal, setNotifModal] = useState<{ open: boolean; message: string; type: 'error' | 'warning' | 'info' }>(
        { open: false, message: "", type: 'info' }
    );
    const showNotif = (message: string, type: 'error' | 'warning' | 'info' = 'info') =>
        setNotifModal({ open: true, message, type });

    // Form state
    const [formData, setFormData] = useState({
        brand: "", model: "", year: "", price: "", transmission: "", mileage: "", description: "",
        owner: "", fcUntil: "", insurance: "", kilometer: ""
    });
    const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

    useEffect(() => {
        if (!loading && !user) router.push("/admin/login");
    }, [user, loading, router]);

    useEffect(() => { fetchCars(); }, []);

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

    const handleDelete = (id: string, name: string) => {
        setConfirmModal({
            open: true,
            message: `Are you sure you want to delete "${name}"? This cannot be undone.`,
            onConfirm: async () => {
                setConfirmModal(c => ({ ...c, open: false }));
                try {
                    await deleteCar(id);
                    fetchCars();
                } catch {
                    showNotif('Failed to delete the car. Please try again.', 'error');
                }
            }
        });
    };

    const resetForm = () => {
        setFormData({ brand: "", model: "", year: "", price: "", transmission: "", mileage: "", description: "", owner: "", fcUntil: "", insurance: "", kilometer: "" });
        setSelectedFuelTypes([]);
        setImageFiles([]);
        setPrimaryImageIndex(0);
    };

    const openAddModal = () => {
        setEditingCar(null);
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (car: any) => {
        setEditingCar(car);
        setFormData({
            brand: car.brand || "", model: car.model || "",
            year: car.year ? car.year.toString() : "", price: car.price ? car.price.toString() : "",
            transmission: car.transmission || "", mileage: car.mileage ? car.mileage.toString() : "",
            description: car.description || "", owner: car.owner || "",
            fcUntil: car.fcUntil ? car.fcUntil.toString() : "",
            insurance: car.insurance || "", kilometer: car.kilometer ? car.kilometer.toString() : ""
        });
        const ft = car.fuelType;
        setSelectedFuelTypes(Array.isArray(ft) ? ft : ft ? [ft] : []);
        setImageFiles([]);
        setPrimaryImageIndex(0);
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFuelTypeToggle = (value: string) => {
        setSelectedFuelTypes(prev =>
            prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
        );
    };

    // Appends new files to existing selection (does NOT replace)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const newFiles = Array.from(e.target.files);
        const currentCount = imageFiles.length;

        if (currentCount >= 10) {
            showNotif('You have already added 10 images. Remove one first before adding more.', 'warning');
            e.target.value = '';
            return;
        }

        const remaining = 10 - currentCount;
        const toAdd = newFiles.slice(0, remaining);

        if (newFiles.length > remaining) {
            showNotif(`Only ${remaining} more image(s) can be added (10 max). ${newFiles.length - remaining} file(s) were skipped.`, 'warning');
        }

        setImageFiles(prev => [...prev, ...toAdd]);
        e.target.value = ''; // reset so user can re-select same files later
    };

    const removeImage = (idx: number) => {
        const updated = imageFiles.filter((_, i) => i !== idx);
        setImageFiles(updated);
        if (primaryImageIndex >= updated.length) {
            setPrimaryImageIndex(Math.max(0, updated.length - 1));
        } else if (primaryImageIndex === idx) {
            setPrimaryImageIndex(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setUploadStatus("");

        try {
            const sendData = new FormData();
            Object.entries(formData).forEach(([key, value]) => sendData.append(key, value));
            selectedFuelTypes.forEach(ft => sendData.append('fuelType', ft));

            if (imageFiles && imageFiles.length > 0) {
                setUploadStatus(`Compressing ${imageFiles.length} image(s)...`);
                const orderedFiles = [...imageFiles];
                if (primaryImageIndex > 0 && primaryImageIndex < orderedFiles.length) {
                    const primary = orderedFiles.splice(primaryImageIndex, 1)[0];
                    orderedFiles.unshift(primary);
                }
                const compressed = await compressImages(orderedFiles);
                setUploadStatus(`Uploading ${compressed.length} image(s) to cloud...`);
                compressed.forEach(file => sendData.append('images', file));
            }

            setUploadStatus('Saving car details...');
            if (editingCar) {
                await updateCar(editingCar._id, sendData);
            } else {
                await createCar(sendData);
            }

            setUploadStatus('');
            setIsModalOpen(false);
            fetchCars();
        } catch (error: any) {
            console.error("Save error:", error);
            showNotif(`Save failed: ${error.message || "Unknown error"}`, 'error');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <button
                        onClick={openAddModal}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-md"
                    >
                        + Add New Car
                    </button>
                </div>

                {/* Cars Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden">
                    {dataLoading ? (
                        <p className="p-8 text-center text-gray-500">Loading inventory...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
                                        <th className="p-4 font-semibold text-sm uppercase">Image</th>
                                        <th className="p-4 font-semibold text-sm uppercase">Car</th>
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
                                                    <Image src={car.imageUrls?.[0] || "https://via.placeholder.com/80"} alt={`${car.brand} ${car.model}`} fill className="object-cover" sizes="80px" />
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-gray-900 dark:text-white">{car.brand} {car.model}</td>
                                            <td className="p-4 text-blue-600 dark:text-blue-400 font-semibold">
                                                {car.price ? `$${car.price.toLocaleString()}` : 'N/A'}
                                            </td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">{car.year || 'N/A'}</td>
                                            <td className="p-4 text-right space-x-3">
                                                <button onClick={() => openEditModal(car)} className="text-blue-500 hover:text-blue-600 font-medium text-sm transition">Edit</button>
                                                <button onClick={() => handleDelete(car._id, `${car.brand} ${car.model}`)} className="text-red-500 hover:text-red-600 font-medium text-sm transition">Delete</button>
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
            </div>

            {/* ── Add / Edit Modal ── */}
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
                                {/* Brand */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand</label>
                                    <input name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                {/* Model */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
                                    <input name="model" value={formData.model} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                {/* Year */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                {/* Mileage */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mileage</label>
                                    <input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                {/* Transmission */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transmission</label>
                                    <select name="transmission" value={formData.transmission} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white">
                                        <option value="">Select...</option>
                                        <option value="Automatic">Automatic</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>
                                {/* Fuel Type — multi-select checkboxes */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Fuel Type <span className="text-xs font-normal text-gray-400">(select all that apply)</span>
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {FUEL_OPTIONS.map(ft => (
                                            <label key={ft} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all select-none ${selectedFuelTypes.includes(ft)
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                                                : 'border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                                                }`}>
                                                <input type="checkbox" checked={selectedFuelTypes.includes(ft)} onChange={() => handleFuelTypeToggle(ft)} className="sr-only" />
                                                {ft}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                    <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"></textarea>
                                </div>
                                {/* Owner */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Owner</label>
                                    <input name="owner" value={formData.owner} onChange={handleInputChange} placeholder="e.g. 1st, 2nd, Company" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                {/* FC Until */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">FC Until <span className="text-xs font-normal text-gray-400">(year)</span></label>
                                    <input type="number" name="fcUntil" value={formData.fcUntil} onChange={handleInputChange} placeholder="e.g. 2027" min="2000" max="2099" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                {/* Insurance */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Insurance</label>
                                    <input name="insurance" value={formData.insurance} onChange={handleInputChange} placeholder="e.g. Comprehensive, Third Party" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>
                                {/* Kilometer */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kilometer</label>
                                    <input type="number" name="kilometer" value={formData.kilometer} onChange={handleInputChange} placeholder="e.g. 45000" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white" />
                                </div>

                                {/* Image Upload */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Images <span className="text-xs font-normal text-gray-400">(Max 10 · tap to set cover · × to remove)</span>
                                    </label>

                                    {/* Counter + Add button row */}
                                    <div className="flex items-center gap-3 flex-wrap mb-3">
                                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${imageFiles.length >= 10
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300'
                                            }`}>
                                            {imageFiles.length}/10
                                        </span>
                                        {imageFiles.length < 10 ? (
                                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                Add Images
                                                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="sr-only" />
                                            </label>
                                        ) : (
                                            <span className="text-xs text-red-500 font-medium">Limit reached. Remove an image to add more.</span>
                                        )}
                                        {editingCar && imageFiles.length === 0 && (
                                            <span className="text-xs text-gray-400 italic">No new images — existing images will be kept.</span>
                                        )}
                                    </div>

                                    {/* Thumbnail grid */}
                                    {imageFiles.length > 0 && (
                                        <div className="flex gap-3 flex-wrap">
                                            {imageFiles.map((file, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-4 transition-all group ${primaryImageIndex === idx
                                                        ? 'border-blue-500 shadow-md scale-105'
                                                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                                        }`}
                                                >
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`preview-${idx}`}
                                                        onClick={() => setPrimaryImageIndex(idx)}
                                                        className="object-cover w-full h-full cursor-pointer"
                                                    />
                                                    {primaryImageIndex === idx && (
                                                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg">COVER</div>
                                                    )}
                                                    {/* Always-visible remove button — critical for mobile touch */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                                        className="absolute top-0.5 left-0.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-md"
                                                        title="Remove image"
                                                    >×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit row */}
                            <div className="flex justify-end items-center pt-4 border-t border-gray-200 dark:border-zinc-800 gap-4">
                                {uploadStatus && (
                                    <div className="flex items-center gap-2 text-sm text-blue-500 font-medium mr-auto">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        {uploadStatus}
                                    </div>
                                )}
                                <button type="button" onClick={() => setIsModalOpen(false)} disabled={formLoading} className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition disabled:opacity-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={formLoading} className={`px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition ${formLoading ? "opacity-70 cursor-not-allowed" : ""}`}>
                                    {formLoading ? "Please wait..." : "Save Car"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Delete Confirmation Modal ── */}
            {confirmModal.open && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Car</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{confirmModal.message}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmModal(c => ({ ...c, open: false }))} className="px-5 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                                Cancel
                            </button>
                            <button onClick={confirmModal.onConfirm} className="px-5 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Notification Modal (error / warning / info) ── */}
            {notifModal.open && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${notifModal.type === 'error' ? 'bg-red-100 dark:bg-red-900/30'
                                : notifModal.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30'
                                    : 'bg-blue-100 dark:bg-blue-900/30'
                                }`}>
                                {notifModal.type === 'error' && (
                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                                {notifModal.type === 'warning' && (
                                    <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0l7.354 12.748zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                )}
                                {notifModal.type === 'info' && (
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold mb-1 ${notifModal.type === 'error' ? 'text-red-700 dark:text-red-400'
                                    : notifModal.type === 'warning' ? 'text-amber-700 dark:text-amber-400'
                                        : 'text-blue-700 dark:text-blue-400'
                                    }`}>
                                    {notifModal.type === 'error' ? 'Error' : notifModal.type === 'warning' ? 'Warning' : 'Notice'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{notifModal.message}</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={() => setNotifModal(n => ({ ...n, open: false }))} className="px-5 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
