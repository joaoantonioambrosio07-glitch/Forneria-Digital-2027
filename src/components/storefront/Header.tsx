import React, { useState } from 'react';
import { CalendarClock, Menu, MessageCircle, ShoppingCart, X } from 'lucide-react';
import type { Restaurant } from '../../types/pizzeria';
import { useCart } from '../../contexts/CartContext';
import { PizzaLogoMark } from '../common/PizzaLogoMark';

interface HeaderProps {
  restaurant: Restaurant;
}

export function Header({ restaurant }: HeaderProps) {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('#topo');

  const navLinks = [
    { label: 'Início', href: '#topo' },
    { label: 'Cardápio', href: '#cardapio' },
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleNavClick = (href: string) => {
    setActiveNav(href);
    setMobileMenuOpen(false);
    if (href === '#topo') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0D0908]/92 backdrop-blur-md border-b border-[#E5A94C]/15">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Lockup */}
        <a
          href="#topo"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#topo');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A94C] rounded-md"
        >
          {restaurant.logoUrl ? (
            <img
              src={restaurant.logoUrl}
              alt={restaurant.name}
              referrerPolicy="no-referrer"
              className="h-9 w-9 rounded-full object-cover border border-[#E5A94C]/50 shrink-0"
            />
          ) : (
            <PizzaLogoMark className="h-9 w-9 shrink-0" />
          )}
          <span className="font-display italic text-xl sm:text-2xl font-semibold tracking-tight text-[#F5EFE6] whitespace-nowrap truncate max-w-[170px] sm:max-w-none">
            {restaurant.name}
          </span>
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#F5EFE6]/80"
        >
          {navLinks.map((link) => {
            const isCurrent = activeNav === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A94C] ${
                  isCurrent
                    ? 'text-[#F5EFE6] border-[#C41E24]'
                    : 'border-transparent hover:text-[#F5EFE6] hover:border-[#E5A94C]/60'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Cart Icon + Primary Order Action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openCart('order')}
            aria-label={`Abrir carrinho com ${totalItems} itens`}
            className="relative inline-flex items-center justify-center h-10 w-10 rounded-full text-[#F5EFE6] hover:bg-[#1C1410] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A94C]"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={1.9} />
            <span className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 rounded-full bg-[#C41E24] text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
              {totalItems}
            </span>
          </button>

          <button
            type="button"
            onClick={() => openCart('order')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-full bg-[#C41E24] text-white text-xs sm:text-sm font-semibold hover:bg-[#D9252B] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A94C]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span>Faça seu pedido</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-[#E5A94C]/25 text-[#F5EFE6] hover:bg-[#1C1410] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5A94C]/15 bg-[#140E0C] px-4 py-4 space-y-2">
          <nav className="flex flex-col gap-1" aria-label="Navegação mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-3 py-3 text-base font-medium text-[#F5EFE6]/90 hover:text-[#E5A94C] hover:bg-[#1C1410] rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCart('order');
              }}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#C41E24] text-white text-xs font-semibold cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Pedir Agora</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCart('schedule');
              }}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#E5A94C]/40 text-[#E5A94C] text-xs font-semibold cursor-pointer"
            >
              <CalendarClock className="h-4 w-4" />
              <span>Agendar</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
