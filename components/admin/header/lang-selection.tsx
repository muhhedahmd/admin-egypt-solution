"use client";
import { useLanguage } from '@/providers/lang';
import React, { useEffect } from 'react';
import { Globe } from 'lucide-react';

export function LanguageToggle({
    currentLang: _currentLang,
}: {
    currentLang: string
}) {
    const { currentLang, switchLanguage
    } = useLanguage();

    return (
        <button
            onClick={() => switchLanguage(currentLang === 'EN' ? 'AR' : 'EN')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
            aria-label="Switch Language"
        >
            <Globe className="h-4 w-4" />
            <span className="font-medium text-sm">
                {_currentLang === 'EN' ? 'English' : 'Arabic'}
            </span>
        </button>
    );
}