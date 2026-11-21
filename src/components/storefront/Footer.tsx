import React from 'react';
import { CalendarClock, MessageCircle } from 'lucide-react';
import type { Restaurant } from '../../types/pizzeria';
import { PizzaLogoMark } from '../common/PizzaLogoMark';
import { useCart } from '../../contexts/CartContext';

interface FooterProps {
  restaurant: Restaurant;
}

export function Footer({ restaurant }: FooterProps) {
  const { openCart } = useCart();

  return (
    <footer className="bg-[#080605] text-[#F5EFE6] border-t border-[#E5A94C]/15 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E5A94C]/12">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            {restaurant.logoUrl ? (
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-full object-cover border border-[#E5A94C]/50"
              />
            ) : (
              <PizzaLogoMark className="h-10 w-10" />
            )}
            <div>
              <p className="font-display italic text-2xl font-semibold text-[#F5EFE6] leading-none">
                {restaurant.name}
              </p>
              <p className="text-[11px] tracking-widest text-[#E5A94C] mt-1">
                {restaurant.tagline}
              </p>
            </div>
          </div>

          {/* Center: Slogan */}
          <p className="font-display italic text-xl sm:text-2xl text-[#E5A94C] text-center">
            Muito mais que pizza, uma experiência!
          </p>

          {/* Right: Order & Schedule Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => openCart('schedule')}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-full border border-[#E5A94C]/40 text-[#E5A94C] text-xs font-semibold hover:bg-[#19120F] transition-colors cursor-pointer whitespace-nowrap"
            >
              <CalendarClock className="h-4 w-4" />
              <span>Agendar</span>
            </button>
            <button
              type="button"
              onClick={() => openCart('order')}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-full bg-[#C41E24] text-white text-xs sm:text-sm font-semibold hover:bg-[#D9252B] transition-colors cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Faça seu pedido agora!</span>
            </button>
          </div>
        </div>

        <div className="pt-6 text-center sm:text-left text-xs text-[#BFB6AA]/70">
          <p>
            © {new Date().getFullYear()} {restaurant.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
