
"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LanguageContextType {
    currentLang: string;
    isRTL: boolean;
    isLoading: boolean;
    switchLanguage: (lang: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
    children: React.ReactNode;
    initialLang: string;
    initialIsRTL: boolean;
}

export function LanguageProvider({
    children,
    initialLang,
    initialIsRTL
}: LanguageProviderProps) {
    const [currentLang, setCurrentLang] = useState(initialLang);
    const [isRTL, setIsRTL] = useState(initialIsRTL);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Update document attributes when language changes
    useEffect(() => {
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLang?.toLowerCase();
    }, [currentLang, isRTL]);

    // Fetch current language from backend
    const fetchCurrentLang = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/company-info/current-lang`, {
                method: 'GET',
                credentials: 'include',
            });

            if (res.ok) {
                const data: {
                    currentLang: string,
                    isRTL: boolean,
                    success: boolean
                } = await res.json()

                if (!data.success) return
                if (data.currentLang && data.currentLang !== currentLang) {
                    setCurrentLang(data.currentLang.toUpperCase());
                    setIsRTL(data.isRTL || data.currentLang.toUpperCase() === 'AR');

                    // Optional: Store in localStorage
                    localStorage.setItem('lang', data.currentLang.toUpperCase());
                    localStorage.setItem('isRTL', String(data.isRTL));
                }
            }
        } catch (error) {
            console.error('Failed to fetch language:', error);

            // Fallback to localStorage
            const storedLang = localStorage.getItem('lang');
            const storedIsRTL = localStorage.getItem('isRTL');

            if (storedLang) {
                setCurrentLang(storedLang);
                setIsRTL(storedIsRTL === 'true');
            }
        }
    };

    // Switch language
    const switchLanguage = async (lang: string) => {
        if (lang === currentLang) return;

        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/company-info/switch-lang`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ lang })
            });

            if (res.ok) {
                const newLang = lang.toUpperCase();
                const newIsRTL = newLang === 'AR';

                setCurrentLang(newLang);
                setIsRTL(newIsRTL);

                localStorage.setItem('lang', newLang);
                localStorage.setItem('isRTL', String(newIsRTL));

                // Refresh to get new translations
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to switch language:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchCurrentLang();
    }, []);

    return (
        <LanguageContext.Provider value={{
            currentLang,
            isRTL,
            isLoading,
            switchLanguage
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};