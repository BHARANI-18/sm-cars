"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Language = "en" | "ta";

type Translations = {
    [key in Language]: {
        [key: string]: string;
    };
};

// Dictionary of translations for the Navbar
const dictionary: Translations = {
    en: {
        "nav.brand": "SM CARS",
        "nav.inventory": "Inventory",
        "nav.dashboard": "Dashboard",
        "nav.logout": "Logout",
        "nav.callUs": "Call Us",
        "theme.dark": "Dark",
        "theme.light": "Light"
    },
    ta: {
        "nav.brand": "எஸ்.எம் கார்ஸ்",
        "nav.inventory": "கார் பட்டியல்",
        "nav.dashboard": "கட்டுப்பாட்டு அறை",
        "nav.logout": "வெளியேறு",
        "nav.callUs": "அழைக்க",
        "theme.dark": "இருள்",
        "theme.light": "வெளிச்சம்"
    }
};

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedLanguage = localStorage.getItem("language") as Language | null;
        if (storedLanguage && (storedLanguage === "en" || storedLanguage === "ta")) {
            setLanguage(storedLanguage);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === "en" ? "ta" : "en";
        setLanguage(newLang);
        localStorage.setItem("language", newLang);
    };

    const t = (key: string): string => {
        return dictionary[language]?.[key] || key;
    };

    // Wait until mounted on client to prevent hydration errors
    const content = mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>;

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {content}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
