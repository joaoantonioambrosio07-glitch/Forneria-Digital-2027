import React from 'react';
import { Award, CalendarClock, Leaf, MessageCircle, Truck } from 'lucide-react';
import type { Restaurant } from '../../types/pizzeria';
import { FoodImage } from '../common/FoodImage';
import { useCart } from '../../contexts/CartContext';

interface HeroSectionProps {
  restaurant: Restaurant;
}

export function HeroSection({ restaurant }: HeroSectionProps) {
  const { openCart } = useCart();

  const scrollToMenu = () => {
    const el = document.querySelector('#cardapio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const highlights = [
    { icon: Leaf, label: 'Ingredientes Naturais' },
    { icon: Truck, label: 'Entrega Rápida' },
    { icon: Award, label: 'Qualidade Garantida' },
  ];

  return (
    <section
      id="topo"
      className="relative overflow-hidden bg-[#0D0908] min-h-[76vh] sm:min-h-[82vh] flex items-center"
    >
      {/* Background Pizza Photography */}
      <div className="absolute inset-0">
        <FoodImage
          src={restaurant.coverImageUrl}
          alt={`Pizza artesanal ${restaurant.name}`}
          priority
          className="h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0D0908]/95 via-[#0D0908]/75 to-[#0D0908]/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#230C0A] via-transparent to-[#0D0908]/50"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-24">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-widest text-[#E5A94C] mb-3">
            {restaurant.tagline}
          </p>

          <h1
            className="font-display font-bold text-[#F5EFE6] leading-[1.04] tracking-tight mb-5"
            style={{
              fontSize: 'clamp(2.5rem, 5.4vw, 4.4rem)',
              textWrap: 'balance',
            }}
          >
            Uma experiência irresistível em{' '}
            <em className="italic font-semibold text-[#E5A94C]">cada fatia.</em>
          </h1>

          <p className="text-base sm:text-lg text-[#F5EFE6]/85 leading-relaxed max-w-lg mb-8">
            {restaurant.description}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mb-10">
            <button
              type="button"
              onClick={scrollToMenu}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-full bg-[#C41E24] text-white text-sm sm:text-base font-semibold hover:bg-[#D9252B] active:scale-[0.99] transition-all duration-150 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A94C]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Ver Cardápio</span>
            </button>

            <button
              type="button"
              onClick={() => openCart('schedule')}
              className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[48px] rounded-full border border-[#E5A94C]/45 bg-[#140E0C]/75 text-[#E5A94C] text-sm sm:text-base font-semibold hover:bg-[#1C1410] hover:border-[#E5A94C] transition-all duration-150 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A94C]"
            >
              <CalendarClock className="h-4 w-4" />
              <span>Agendar Pedido</span>
            </button>
          </div>

          {/* 3 Clean Trust Pillars */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full border border-[#E5A94C]/40 bg-[#140E0C]/70 flex items-center justify-center text-[#E5A94C] shrink-0">
                    <Icon className="h-4 w-4" strokeWidth={1.7} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#F5EFE6]/85 max-w-[110px] leading-tight">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
