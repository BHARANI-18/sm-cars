"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-zinc-800 rounded-xl">
                <span className="text-gray-400 text-lg">No images available</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnails — vertical on desktop, horizontal on mobile */}
            {images.length > 1 && (
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px] order-2 md:order-1 pb-2 md:pb-0 md:pr-2 flex-shrink-0">
                    {images.map((url, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none ${selectedIndex === idx
                                    ? "border-blue-500 shadow-md scale-105"
                                    : "border-gray-200 dark:border-zinc-700 hover:border-blue-300 hover:scale-105"
                                }`}
                        >
                            <Image
                                src={url}
                                alt={`${title} thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Main large image */}
            <div className="relative flex-1 order-1 md:order-2">
                <div className="relative w-full h-72 sm:h-96 md:h-[500px] bg-gray-100 dark:bg-zinc-800 rounded-xl overflow-hidden shadow-inner">
                    <Image
                        src={images[selectedIndex]}
                        alt={`${title} - image ${selectedIndex + 1}`}
                        fill
                        className="object-contain transition-opacity duration-300"
                        sizes="(max-width: 768px) 100vw, 70vw"
                        priority
                    />
                </div>

                {/* Image counter badge */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {selectedIndex + 1} / {images.length}
                    </div>
                )}

                {/* Arrow navigation */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => setSelectedIndex(i => (i - 1 + images.length) % images.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 text-gray-800 dark:text-white rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all"
                            aria-label="Previous image"
                        >
                            ‹
                        </button>
                        <button
                            onClick={() => setSelectedIndex(i => (i + 1) % images.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 text-gray-800 dark:text-white rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all"
                            aria-label="Next image"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
