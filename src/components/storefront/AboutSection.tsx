import React, { useState } from 'react';
import {
  ArrowRight,
  Clock,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import type { Restaurant } from '../../types/pizzeria';
import { FoodImage } from '../common/FoodImage';
import heroPizzaImg from '../../assets/images/hero_artisanal_pizza_1795118287638.webp';

interface AboutSectionProps {
  restaurant: Restaurant;
}

export function AboutSection({ restaurant }: AboutSectionProps) {
  const [storyOpen, setStoryOpen] = useState(false);

  const digits = restaurant.whatsappNumber.replace(/\D/g, '');
  const normalizedPhone =
    digits.startsWith('55') || digits.length >= 12 ? digits : `55${digits}`;
  const formattedDisplayPhone =
    digits.length >= 11
      ? `(${digits.slice(-11, -9)}) ${digits.slice(-9, -4)}-${digits.slice(-4)}`
      : restaurant.whatsappNumber;

  const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
    `Olá, ${restaurant.name}! Gostaria de mais informações.`
  )}`;

  return (
    <section
      id="sobre"
      className="relative bg-[#0D0908] text-[#F5EFE6] border-t border-[#E5A94C]/18 overflow-hidden scroll-mt-16"
    >
      {/* Atmospheric Wood-Fired Background */}
      <div className="absolute inset-0">
        <FoodImage
          src={heroPizzaImg}
          alt={`Forno a lenha da ${restaurant.name}`}
          className="h-full w-full object-cover object-center opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0D0908]/95 via-[#0D0908]/80 to-[#0D0908]/90"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Story & CTA */}
          <div className="lg:col-span-7">
            <h2 className="font-display italic text-4xl sm:text-5xl font-semibold text-[#F5EFE6] mb-4">
              {restaurant.aboutTitle || 'Sobre Nós'}
            </h2>
            <p className="text-base sm:text-lg text-[#F5EFE6]/85 leading-relaxed max-w-xl mb-7">
              {restaurant.aboutText}
            </p>
            <button
              type="button"
              onClick={() => setStoryOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3 min-h-[44px] rounded-full bg-[#E5A94C] text-[#0D0908] text-sm font-semibold hover:bg-[#EEB968] transition-colors cursor-pointer"
            >
              <span>Conheça nossa história</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right: Address, Hours, WhatsApp & Social Card */}
          <div
            id="contato"
            className="lg:col-span-5 bg-[#160F0D]/92 backdrop-blur-md border border-[#E5A94C]/30 rounded-2xl p-6 space-y-5 scroll-mt-24"
          >
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full border border-[#E5A94C]/35 flex items-center justify-center text-[#E5A94C] shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#BFB6AA]">Endereço</p>
                <p className="text-sm font-medium text-[#F5EFE6] mt-0.5 leading-snug">
                  {restaurant.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full border border-[#E5A94C]/35 flex items-center justify-center text-[#E5A94C] shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#BFB6AA]">Funcionamento</p>
                <p className="text-sm font-medium text-[#F5EFE6] mt-0.5 leading-snug">
                  {restaurant.openingHours}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full border border-[#E5A94C]/35 flex items-center justify-center text-[#E5A94C] shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#BFB6AA]">WhatsApp</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#F5EFE6] hover:text-[#E5A94C] tabular-nums mt-0.5 inline-block transition-colors"
                >
                  {formattedDisplayPhone}
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5A94C]/15 flex items-center justify-center gap-4">
              {restaurant.instagramUrl ? (
                <a
                  href={restaurant.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="h-9 w-9 rounded-full border border-[#E5A94C]/25 flex items-center justify-center text-[#F5EFE6]/80 hover:text-[#E5A94C] hover:border-[#E5A94C] transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              ) : null}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="h-9 w-9 rounded-full border border-[#E5A94C]/25 flex items-center justify-center text-[#F5EFE6]/80 hover:text-[#E5A94C] hover:border-[#E5A94C] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Story Modal */}
      {storyOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0D0908]/85 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setStoryOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full bg-[#18110E] border border-[#E5A94C]/30 rounded-2xl p-6 sm:p-8 text-[#F5EFE6] relative"
          >
            <button
              type="button"
              onClick={() => setStoryOpen(false)}
              aria-label="Fechar história"
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-[#241B17] text-[#F5EFE6] flex items-center justify-center hover:bg-[#332620] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-xs font-semibold tracking-widest text-[#E5A94C] mb-2">
              {restaurant.tagline}
            </p>
            <h3 className="font-display italic text-3xl font-semibold mb-4">
              {restaurant.name}
            </h3>
            <p className="text-sm text-[#F5EFE6]/85 leading-relaxed mb-5">
              {restaurant.aboutText}
            </p>
            <div className="space-y-3 pt-4 border-t border-[#E5A94C]/15 text-xs text-[#BFB6AA]">
              <p>
                <strong className="text-[#E5A94C]">Fermentação Lenta 48h:</strong> Massa leve e aerada preparada diariamente com farinha selecionada.
              </p>
              <p>
                <strong className="text-[#E5A94C]">Forno a Lenha Tradicional:</strong> Alta temperatura para preservar a umidade dos ingredientes e garantir bordas crocantes.
              </p>
              <p>
                <strong className="text-[#E5A94C]">Atendimento Sob Medida:</strong> Peça agora ou agende sua entrega e reserva pelo WhatsApp.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
