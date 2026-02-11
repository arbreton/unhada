"use client";

import React from 'react';
import { Sparkles, ArrowLeft, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-[#F3F0E7] text-[#4A5D4E] font-sans overflow-x-hidden">

            {/* --- BACKGROUND ORBS --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="floating-orb w-96 h-96 bg-[#D8D0E3] opacity-40 top-[-10%] left-[-10%]"></div>
                <div className="floating-orb w-80 h-80 bg-[#E0F7FA] opacity-50 bottom-[10%] right-[-5%] animation-delay-2000"></div>
            </div>

            {/* --- NAVEGACIÓN SIMPLE --- */}
            <nav className="fixed w-full z-50 py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <Link href="/" className="inline-flex items-center gap-2 hover:bg-white/40 px-4 py-2 rounded-full transition-all">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-body font-medium">Volver a Unhada</span>
                    </Link>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <div className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col justify-center items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/40 backdrop-blur-md p-12 rounded-3xl border border-[#D8D0E3] max-w-2xl shadow-xl"
                >
                    <div className="w-16 h-16 bg-[#F3F0E7] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Sparkles className="w-8 h-8 text-[#B87333]" />
                    </div>

                    <h1 className="font-celtic text-4xl md:text-5xl mb-6 text-[#2F3E34]">
                        El Blog del Bosque
                    </h1>

                    <p className="font-body text-lg text-[#4A5D4E]/80 leading-relaxed mb-8">
                        Estamos preparando pociones de sabiduría para ti. Pronto encontrarás artículos sobre biohacking, psicología y los ciclos lunares.
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B87333]/10 text-[#B87333] font-bold text-sm">
                        <Star className="w-4 h-4" />
                        <span>Próximamente</span>
                    </div>
                </motion.div>
            </div>

        </div>
    );
}
