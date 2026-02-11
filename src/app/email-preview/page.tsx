"use client";

import React, { useState } from 'react';
import { getNewsletterWelcomeEmail, getFreeDownloadEmail, getPurchaseReceiptEmail } from '@/lib/email-templates';

export default function EmailPreviewPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<'welcome' | 'free' | 'receipt'>('welcome');

    let htmlContent = '';
    switch (selectedTemplate) {
        case 'welcome':
            htmlContent = getNewsletterWelcomeEmail();
            break;
        case 'free':
            htmlContent = getFreeDownloadEmail('Rituales de Amor Propio', '#');
            break;
        case 'receipt':
            htmlContent = getPurchaseReceiptEmail('Ariane', 'PREVIEW-123', [
                { name: 'Carta Astral & Biohacking', link: '#' },
                { name: 'Audio de Meditación', link: '#' }
            ]);
            break;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Controls */}
            <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-4">
                <h2 className="font-bold text-lg text-gray-800">Email Previews</h2>

                <button
                    onClick={() => setSelectedTemplate('welcome')}
                    className={`text-left px-4 py-2 rounded-lg transition-colors ${selectedTemplate === 'welcome' ? 'bg-[#4A5D4E] text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    Welcome Email
                </button>

                <button
                    onClick={() => setSelectedTemplate('free')}
                    className={`text-left px-4 py-2 rounded-lg transition-colors ${selectedTemplate === 'free' ? 'bg-[#4A5D4E] text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    Free Download
                </button>

                <button
                    onClick={() => setSelectedTemplate('receipt')}
                    className={`text-left px-4 py-2 rounded-lg transition-colors ${selectedTemplate === 'receipt' ? 'bg-[#4A5D4E] text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    Purchase Receipt
                </button>

                <div className="mt-auto border-t pt-4 text-xs text-gray-400">
                    Unhada Dev Tools
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gray-200/50">
                <div className="bg-white shadow-2xl rounded-xl overflow-hidden w-full max-w-[650px] h-[800px]">
                    <div className="bg-gray-50 border-b px-4 py-2 text-xs text-gray-500 flex justify-between">
                        <span>Preview Mode</span>
                        <span>600px Width</span>
                    </div>
                    <iframe
                        srcDoc={htmlContent}
                        className="w-full h-full border-none"
                        title="Email Preview"
                    />
                </div>
            </div>
        </div>
    );
}
