"use client";

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
    const [upsellAccepted, setUpsellAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    if (!isOpen || !product) return null;

    const isFree = product.price === 0;

    const handleCheckout = async () => {
        if (isFree && !email) {
            alert('Por favor ingresa tu correo para enviarte el regalo.');
            return;
        }

        setLoading(true);

        try {
            if (isFree) {
                const response = await fetch('/api/free-download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, productId: product.id }),
                });

                if (response.ok) {
                    alert('¡Enviado! Revisa tu correo mágico. ✨');
                    onClose();
                } else {
                    alert('Hubo un error al enviar el correo.');
                }
            } else {
                // PAID FLOW
                const items = [{ id: product.id }];
                if (upsellAccepted && product.upsell) {
                    items.push({ id: product.upsell.id });
                }

                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items }),
                });

                const { url } = await response.json();
                if (url) {
                    window.location.href = url;
                } else {
                    alert('Error al iniciar el pago.');
                }
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = (product.price + (upsellAccepted && product.upsell ? product.upsell.price : 0)) / 100;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-[#F3F0E7] w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden border border-[#D8D0E3]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative h-32 bg-[#4A5D4E] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#B87333]/20 to-transparent"></div>
                        <Sparkles className="text-[#D8D0E3] w-12 h-12 relative z-10" />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8">
                        <h2 className="font-celtic text-3xl mb-2 text-[#2F3E34]">{product.name}</h2>
                        <p className="font-body text-[#4A5D4E]/80 mb-6 leading-relaxed">
                            {product.longDescription}
                        </p>

                        {/* DYNAMIC CONTENT: FREE VS PAID */}
                        {isFree ? (
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-[#4A5D4E] mb-2">Tu Correo Mágico</label>
                                <input
                                    type="email"
                                    placeholder="hada@bosque.com"
                                    className="w-full px-4 py-3 rounded-xl border border-[#4A5D4E]/20 focus:border-[#B87333] focus:outline-none bg-white/60"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <p className="text-xs text-[#4A5D4E]/60 mt-2">Te enviaremos el PDF y el acceso aquí.</p>
                            </div>
                        ) : (
                            /* UPSELL SECTION (ONLY FOR PAID) */
                            product.upsell && (
                                <div className="mb-6 bg-[#E0F7FA]/50 p-4 rounded-xl border border-[#4682B4]/20">
                                    <label className="flex items-start gap-4 cursor-pointer">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#4682B4] checked:bg-[#4682B4] checked:border-transparent transition-all"
                                                checked={upsellAccepted}
                                                onChange={(e) => setUpsellAccepted(e.target.checked)}
                                            />
                                            <CheckCircle className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-3 h-3 left-1 top-1" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-[#4682B4] block text-sm">
                                                ¿Complementar tu magia? (+${product.upsell.price / 100})
                                            </span>
                                            <span className="text-xs text-[#4A5D4E]/70 block mt-1">
                                                {product.upsell.description}
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            )
                        )}

                        {/* ACTION BUTTON */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#4A5D4E]/10">
                            <div>
                                <span className="text-xs uppercase tracking-widest text-[#4A5D4E]/60 block mb-1">Total</span>
                                <span className="font-celtic text-3xl text-[#2F3E34]">
                                    {isFree ? 'GRATIS' : `$${totalPrice.toFixed(2)}`}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="px-8 py-3 bg-[#B87333] text-white rounded-full font-bold shadow-lg hover:bg-[#A06028] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                            >
                                {loading ? 'Enviando...' : (
                                    <>
                                        <span>{isFree ? 'Enviar a mi correo' : 'Pagar'}</span>
                                        {isFree ? <CheckCircle className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-[#4A5D4E]/40 mt-4">
                            {isFree ? 'Recibirás el enlace de descarga al instante.' : 'Pago seguro vía Stripe. Aceptamos Apple Pay, Google Pay y Tarjetas.'}
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
