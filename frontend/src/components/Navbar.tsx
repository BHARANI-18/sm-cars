"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-black text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                {/* Top row — logo + phone */}
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter text-blue-500 hover:text-blue-400 transition">
                        SM CARS
                    </Link>

                    {/* Phone number — tap to call on mobile */}
                    <a
                        href="tel:9543182448"
                        className="flex items-center gap-1.5 text-sm font-semibold text-green-400 hover:text-green-300 transition"
                        aria-label="Call us at 9543182448"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.01 21 3 13.99 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.21 2.21z" />
                        </svg>
                        <span className="hidden xs:inline">9543182448</span>
                        <span className="xs:hidden">Call Us</span>
                    </a>
                </div>

                {/* Bottom row — nav links */}
                <div className="flex items-center gap-4 mt-2 text-sm">
                    <Link href="/" className="hover:text-blue-400 font-medium transition">
                        Inventory
                    </Link>
                    <Link
                        href={user ? "/admin/dashboard" : "/admin/login"}
                        className="text-gray-300 hover:text-white font-medium transition"
                    >
                        Dashboard
                    </Link>
                    {user && (
                        <button
                            onClick={logout}
                            className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-semibold transition"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
