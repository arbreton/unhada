"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Leaf, Brain, Sun, Moon, Droplets, Heart, ArrowRight, Star, ShoppingBag, Mail, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { products, Product } from '@/lib/products';
import { ProductModal } from '@/components/ProductModal';

const UnhadaLife = () => {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Efecto para la barra de navegación al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribeStatus('success');
        setEmail('');
      } else {
        setSubscribeStatus('idle');
        alert('Hubo un error al suscribirte. Intenta de nuevo.');
      }
    } catch (error) {
      console.error(error);
      setSubscribeStatus('idle');
      alert('Hubo un error al suscribirte. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F0E7] text-[#4A5D4E] font-sans selection:bg-[#D8D0E3] selection:text-[#4A5D4E] overflow-x-hidden">

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* --- BACKGROUND ORBS (AMBIENTE MÁGICO) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb w-96 h-96 bg-[#D8D0E3] opacity-40 top-[-10%] left-[-10%]"></div>
        <div className="floating-orb w-80 h-80 bg-[#E0F7FA] opacity-50 bottom-[10%] right-[-5%] animation-delay-2000"></div>
        <div className="floating-orb w-64 h-64 bg-[#F5E6D3] opacity-40 top-[40%] left-[30%] animation-delay-4000"></div>
      </div>

      {/* --- NAVEGACIÓN --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'glass-panel py-3 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#B87333]" />
            <span className="font-celtic text-2xl font-bold tracking-wider text-[#4A5D4E]">UNHADA<span className="text-[#B87333]">.LIFE</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-body text-sm font-medium tracking-wide">
            <button onClick={() => scrollToSection('elements')} className="hover:text-[#B87333] transition-colors">Los Elementos</button>
            <button onClick={() => scrollToSection('shop')} className="hover:text-[#B87333] transition-colors">Grimorio (Tienda)</button>
            <button onClick={() => scrollToSection('elements')} className="hover:text-[#B87333] transition-colors">Biohacking</button>
            <button onClick={() => scrollToSection('astrology')} className="hover:text-[#B87333] transition-colors">Astrología</button>
          </div>

          <button
            onClick={() => scrollToSection('astrology')}
            className="hidden md:flex px-6 py-2 bg-[#4A5D4E] text-[#F3F0E7] rounded-full font-body text-sm hover:bg-[#3A4A3E] transition-all shadow-lg hover:shadow-[#D8D0E3]/50"
          >
            Únete al Círculo
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6 border border-[#B87333]/30"
          >
            <Star className="w-4 h-4 text-[#B87333]" />
            <span className="font-body text-xs font-semibold tracking-widest uppercase text-[#B87333]">Donde la Magia encuentra la Ciencia</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-celtic text-5xl md:text-7xl leading-tight mb-8 text-[#2F3E34]"
          >
            Sanación Celta <br />
            <span className="italic font-light text-[#4A5D4E]/80 font-body">&</span> Biohacking Moderno
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-lg md:text-xl text-[#4A5D4E]/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Un espacio para hadas urbanas. Descubre el equilibrio entre la psicología profunda, la nutrición ancestral y la energía de los astros.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={() => scrollToSection('elements')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#B87333] text-white rounded-full font-body font-medium hover:bg-[#A06028] transition-all shadow-xl flex items-center gap-2"
            >
              Explora tu Magia <ArrowRight className="w-4 h-4" />
            </motion.button>

            <Link href="/blog">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.8)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass-panel text-[#4A5D4E] border border-[#4A5D4E]/20 rounded-full font-body font-medium transition-all"
              >
                Leer el Blog
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* --- LOS 4 ELEMENTOS (GRID DE SERVICIOS) --- */}
      <section id="elements" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-celtic text-3xl md:text-4xl mb-4">Los 4 Pilares de Sanación</h2>
            <p className="font-body text-[#4A5D4E]/70">Un enfoque holístico que integra cuerpo, mente y espíritu.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TIERRA */}
            <div className="glass-panel p-8 rounded-2xl card-hover transition-all duration-300 border-b-4 border-b-[#4A5D4E]">
              <div className="w-12 h-12 bg-[#4A5D4E]/10 rounded-full flex items-center justify-center mb-6">
                <Leaf className="w-6 h-6 text-[#4A5D4E]" />
              </div>
              <h3 className="font-celtic text-xl mb-3">Tierra</h3>
              <p className="font-body text-sm text-[#4A5D4E]/80 leading-relaxed mb-4">
                Nutrición consciente, cristales, plantas medicinales y arraigo. La base de tu salud física.
              </p>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B87333]">Herbolaria & Nutrientes</span>
            </div>

            {/* AIRE */}
            <div className="glass-panel p-8 rounded-2xl card-hover transition-all duration-300 border-b-4 border-b-[#D8D0E3]">
              <div className="w-12 h-12 bg-[#D8D0E3]/30 rounded-full flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-[#6B5B95]" />
              </div>
              <h3 className="font-celtic text-xl mb-3">Aire</h3>
              <p className="font-body text-sm text-[#4A5D4E]/80 leading-relaxed mb-4">
                Psicología, mindfulness y claridad mental. Entendiendo los patrones de tu psique.
              </p>
              <span className="text-xs font-bold uppercase tracking-widest text-[#6B5B95]">Psicología & Tarot</span>
            </div>

            {/* FUEGO */}
            <div className="glass-panel p-8 rounded-2xl card-hover transition-all duration-300 border-b-4 border-b-[#B87333]">
              <div className="w-12 h-12 bg-[#B87333]/10 rounded-full flex items-center justify-center mb-6">
                <Sun className="w-6 h-6 text-[#B87333]" />
              </div>
              <h3 className="font-celtic text-xl mb-3">Fuego</h3>
              <p className="font-body text-sm text-[#4A5D4E]/80 leading-relaxed mb-4">
                Biohacking, ejercicio, danza y energía vital. Optimiza tu biología para brillar.
              </p>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B87333]">Movimiento & Vitalidad</span>
            </div>

            {/* AGUA */}
            <div className="glass-panel p-8 rounded-2xl card-hover transition-all duration-300 border-b-4 border-b-[#89CFF0]">
              <div className="w-12 h-12 bg-[#89CFF0]/20 rounded-full flex items-center justify-center mb-6">
                <Droplets className="w-6 h-6 text-[#4682B4]" />
              </div>
              <h3 className="font-celtic text-xl mb-3">Agua</h3>
              <p className="font-body text-sm text-[#4A5D4E]/80 leading-relaxed mb-4">
                Gestión emocional, empatía, sensibilidad y astrología lunar. Fluye con tus ciclos.
              </p>
              <span className="text-xs font-bold uppercase tracking-widest text-[#4682B4]">Emociones & Luna</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DESTACADA: TIENDA (GRIMORIO) --- */}
      <section id="shop" className="py-20 px-6 bg-white/40 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">

          <div className="w-full md:w-1/3">
            <div className="inline-flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-[#B87333]" />
              <span className="font-body text-sm font-bold uppercase tracking-widest text-[#4A5D4E]">El Grimorio Digital</span>
            </div>
            <h2 className="font-celtic text-4xl mb-6">Sabiduría Ancestral en Formato PDF</h2>
            <p className="font-body text-[#4A5D4E]/80 mb-8 leading-relaxed">
              Descarga guías prácticas diseñadas con amor. Desde protocolos de biohacking para el sueño hasta guías de tránsitos astrológicos para tu signo.
            </p>
            <button className="text-[#B87333] font-bold border-b-2 border-[#B87333] pb-1 hover:text-[#A06028] transition-colors">
              Ver toda la colección &rarr;
            </button>
          </div>

          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-[#F3F0E7] p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-[#4A5D4E]/10 group cursor-pointer relative overflow-hidden"
              >
                {product.price === 0 ? (
                  <div className="absolute top-0 right-0 bg-[#4A5D4E] text-white text-xs px-3 py-1 rounded-bl-lg font-bold">GRATIS</div>
                ) : (
                  <div className="absolute top-0 right-0 bg-[#B87333] text-white text-xs px-3 py-1 rounded-bl-lg font-bold">PREMIUM</div>
                )}

                <div className={`h-40 rounded-lg mb-4 flex items-center justify-center transition-colors ${product.price === 0 ? 'bg-[#B8D8C0]/30 group-hover:bg-[#B8D8C0]/50' : 'bg-[#D8D0E3]/30 group-hover:bg-[#D8D0E3]/50'}`}>
                  {product.price === 0 ? (
                    <Heart className="w-12 h-12 text-[#4A5D4E] opacity-50" />
                  ) : (
                    <Moon className="w-12 h-12 text-[#6B5B95] opacity-50" />
                  )}
                </div>

                <h4 className="font-celtic text-lg mb-1">{product.name}</h4>
                <p className="text-sm text-[#4A5D4E]/60 mb-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#4A5D4E]">
                    {product.price === 0 ? 'Free Download' : `$${(product.price / 100).toFixed(2)} USD`}
                  </span>
                  <span className="text-xs text-[#B87333] font-bold uppercase">
                    {product.price === 0 ? 'Descargar' : 'Añadir'}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- NEWSLETTER ASTROLOGÍA --- */}
      <section id="astrology" className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-10 md:p-16 text-center border border-[#D8D0E3] relative overflow-hidden">
          {/* Decorative background elements inside card */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#D8D0E3] via-[#B87333] to-[#D8D0E3]"></div>

          <Mail className="w-10 h-10 text-[#4A5D4E] mx-auto mb-6" />

          <h2 className="font-celtic text-3xl md:text-5xl mb-4 text-[#2F3E34]">El Boletín de las Hadas</h2>
          <p className="font-body text-[#4A5D4E]/80 mb-8 max-w-lg mx-auto">
            Recibe semanalmente tu horóscopo enfocado en sanación, tips de psicología y descuentos exclusivos para la tienda.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Tu correo mágico..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
              className="flex-1 px-6 py-4 rounded-full bg-white/60 border border-[#4A5D4E]/20 focus:outline-none focus:border-[#B87333] text-[#4A5D4E] placeholder-[#4A5D4E]/40"
              required
            />
            <button
              disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
              className="px-8 py-4 bg-[#4A5D4E] text-[#F3F0E7] font-bold rounded-full hover:bg-[#2F3E34] transition-colors shadow-lg disabled:opacity-80 flex items-center justify-center min-w-[140px]"
            >
              {subscribeStatus === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : subscribeStatus === 'success' ? (
                <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> ¡Suscrito!</span>
              ) : (
                'Suscribirme'
              )}
            </button>
          </form>

          {subscribeStatus === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#B87333] font-medium mt-4 bg-white/50 inline-block px-4 py-2 rounded-full"
            >
              ¡Gracias por unirte al círculo mágico! Revisa tu correo pronto. ✨
            </motion.p>
          )}

          <p className="text-xs text-[#4A5D4E]/50 mt-6">
            Sin spam, solo buenas vibras y polvo de estrellas.
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#4A5D4E] text-[#F3F0E7] py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#B87333]" />
              <span className="font-celtic text-xl font-bold tracking-wider">UNHADA</span>
            </div>
            <p className="text-sm text-[#F3F0E7]/60 leading-relaxed">
              Uniendo la sabiduría antigua con la ciencia del futuro.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#B87333]">Explora</h4>
            <ul className="space-y-2 text-sm text-[#F3F0E7]/70">
              <li><a href="#" className="hover:text-white">Sobre Mí</a></li>
              <li><a href="#" className="hover:text-white">Tienda PDF</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#B87333]">Legal</h4>
            <ul className="space-y-2 text-sm text-[#F3F0E7]/70">
              <li><a href="#" className="hover:text-white">Términos</a></li>
              <li><a href="#" className="hover:text-white">Privacidad</a></li>
              <li><a href="#" className="hover:text-white">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#B87333]">Sígueme</h4>
            <div className="flex gap-4">
              {/* Social Placeholders */}
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#B87333] cursor-pointer transition-colors">IG</div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#B87333] cursor-pointer transition-colors">TK</div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#B87333] cursor-pointer transition-colors">YT</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs text-[#F3F0E7]/40">
          © 2024 Unhada.life - Todos los derechos reservados. Diseñado con magia.
        </div>
      </footer>
    </div>
  );
};

export default UnhadaLife;
