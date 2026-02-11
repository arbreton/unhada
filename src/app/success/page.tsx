"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        if (sessionId) {
            fetch(`/api/order?session_id=${sessionId}`)
                .then((res) => res.json())
                .then((data) => {
                    setOrder(data);
                    setLoading(false);

                    // DEV MODE: Auto-trigger test email since webhooks don't fire locally
                    if (process.env.NODE_ENV === 'development') {
                        triggerDevEmail(data.customer_email);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [sessionId]);

    const triggerDevEmail = async (email: string) => {
        try {
            await fetch(`/api/test-webhook?email=${email}`);
            setEmailSent(true);
        } catch (e) {
            console.error("Failed to send dev email", e);
        }
    };

    if (loading) {
        return <div className="text-[#4A5D4E]">Cargando tu magia...</div>;
    }

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-[#4A5D4E]/10"
        >
            <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-[#F3F0E7] rounded-full flex items-center justify-center">
                    <span className="text-4xl">✨</span>
                </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif text-[#2F3E34] mb-2">
                ¡Pago Confirmado!
            </h1>

            {order && (
                <div className="mb-6 text-sm">
                    <p className="text-[#4A5D4E]/80 mb-2 font-mono">Orden #{order.payment_status === 'paid' ? sessionId?.slice(-6).toUpperCase() : 'PENDING'}</p>
                    <div className="bg-[#F3F0E7] p-4 rounded-lg text-left">
                        <p className="text-[#2F3E34] font-bold mb-2 border-b border-[#4A5D4E]/10 pb-2">Resumen</p>
                        {order.items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-[#4A5D4E] mb-1">
                                <span>{item.description}</span>
                                <span>{(item.amount_total / 100).toFixed(2)} {item.currency.toUpperCase()}</span>
                            </div>
                        ))}
                        <div className="flex justify-between text-[#2F3E34] font-bold mt-2 pt-2 border-t border-[#4A5D4E]/10">
                            <span>Total</span>
                            <span>{order.amount_total ? (order.amount_total / 100).toFixed(2) : '0.00'} {order.currency?.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-[#4A5D4E] mb-4 leading-relaxed">
                Gracias por tu compra. Tu magia ha sido enviada a <strong>{order?.customer_email || 'tu correo'}</strong>.
            </p>

            {emailSent && (
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full inline-block mb-4">
                    📧 Email de prueba enviado (Dev Mode)
                </div>
            )}

            <div className="bg-[#E0F7FA]/50 p-4 rounded-lg mb-8 text-sm text-[#4A5D4E]">
                <p><strong>Nota:</strong> Revisa tu bandeja de entrada (y spam) para encontrar tus enlaces de descarga.</p>
            </div>

            <Link
                href="/"
                className="inline-block bg-[#B87333] text-white font-bold py-3 px-8 rounded-full hover:bg-[#A66329] transition-all transform hover:scale-105 shadow-md"
            >
                Volver al Bosque
            </Link>
        </motion.div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-[#F3F0E7] flex flex-col items-center justify-center p-6 text-center">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
            <div className="mt-8 text-[#4A5D4E]/40 text-xs">
                Unhada.life
            </div>
        </div>
    );
}
