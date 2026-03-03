"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-black text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-blue-500 hover:text-blue-400 transition">
                    SM MOTORS
                </Link>
                <div className="flex items-center space-x-6">
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
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
