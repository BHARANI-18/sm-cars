"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-gray-100 shadow-sm sticky top-0 z-50 transition-colors duration-300">
            <div className="container mx-auto px-4 py-3">
                {/* Top row — logo + phone + toggles */}
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter text-blue-600 dark:text-blue-500 hover:text-blue-500 transition">
                        {t("nav.brand")}
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Translator Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 transition"
                            aria-label="Toggle language"
                        >
                            {language === "en" ? "தமிழ்" : "EN"}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 transition"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? t("theme.dark") : t("theme.light")}
                        </button>

                        {/* Phone number — tap to call on mobile */}
                        <a
                            href="tel:9543182448"
                            className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-500 transition"
                            aria-label="Call us at 9543182448"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.01 21 3 13.99 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.21 2.21z" />
                            </svg>
                            <span className="hidden xs:inline">9543182448</span>
                            <span className="xs:hidden">{t("nav.callUs")}</span>
                        </a>
                    </div>
                </div>

                {/* Bottom row — nav links */}
                <div className="flex items-center gap-4 mt-2 text-sm">
                    <Link href="/" className="hover:text-blue-500 font-medium transition">
                        {t("nav.inventory")}
                    </Link>
                    <Link
                        href={user ? "/admin/dashboard" : "/admin/login"}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition"
                    >
                        {t("nav.dashboard")}
                    </Link>
                    {user && (
                        <button
                            onClick={logout}
                            className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-semibold transition"
                        >
                            {t("nav.logout")}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

