'use client';

import { MessageCircle, Phone, X } from 'lucide-react';
import { useState } from 'react';

export default function FloatingActions() {
    const [isOpen, setIsOpen] = useState(false);

    const lineId = "SiamSausage"; // Replace with real ID
    const phoneNumber = "0891234567";

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
            {/* Action Buttons */}
            {isOpen && (
                <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-5 duration-300">
                    <a
                        href={`tel:${phoneNumber}`}
                        className="flex items-center gap-3 bg-white text-brand-900 px-4 py-3 rounded-2xl shadow-xl border border-brand-100 font-bold hover:bg-brand-50 transition-all group"
                    >
                        <span className="text-sm">โทรสอบถาม</span>
                        <div className="w-10 h-10 bg-brand-100 text-brand-800 rounded-xl flex items-center justify-center group-hover:bg-brand-900 group-hover:text-white transition-colors">
                            <Phone className="w-5 h-5" />
                        </div>
                    </a>
                    <a
                        href={`https://line.me/ti/p/~${lineId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white text-[#06C755] px-4 py-3 rounded-2xl shadow-xl border border-brand-100 font-bold hover:bg-[#06C755]/5 transition-all group"
                    >
                        <span className="text-sm">คุยผ่าน LINE</span>
                        <div className="w-10 h-10 bg-[#06C755]/10 text-[#06C755] rounded-xl flex items-center justify-center group-hover:bg-[#06C755] group-hover:text-white transition-colors">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                    </a>
                </div>
            )}

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isOpen
                        ? 'bg-brand-900 text-white rotate-90'
                        : 'bg-accent-500 text-white hover:scale-110 shadow-accent-500/30'
                    }`}
                aria-label="ติดต่อเรา"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}

                {/* Notification Ping */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </button>
        </div>
    );
}
