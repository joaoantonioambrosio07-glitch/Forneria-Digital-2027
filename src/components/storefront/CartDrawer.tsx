import React, { useEffect, useState } from 'react';
import {
  CalendarClock,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import type { CartItem, Product, Restaurant } from '../../types/pizzeria';
import { useCart } from '../../contexts/CartContext';
import {
  buildWhatsAppOrder,
  buildWhatsAppScheduleOrder,
  formatBRL,
} from '../../lib/format';
import { FoodImage } from '../common/FoodImage';

interface CartDrawerProps {
  restaurant: Restaurant;
  products: Product[];
  onEditCartItem: (product: Product, cartItem: CartItem) => void;
}

const TIME_SLOTS = [
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
];

function getLocalTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CartDrawer({ restaurant, products, onEditCartItem }: CartDrawerProps) {
  const {
    items,
    totalItems,
    totalCents,
    isCartOpen,
    activeTab,
    setActiveTab,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  // Shared customer fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão na Entrega' | 'Dinheiro'>(
    'PIX'
  );
  const [orderNotes, setOrderNotes] = useState('');

  // Scheduling fields (Aba Agendar)
  const [scheduleType, setScheduleType] = useState<'order' | 'reservation'>('order');
  const [scheduledDate, setScheduledDate] = useState(getLocalTodayIso);
  const [scheduledTime, setScheduledTime] = useState('19:30');
  const [guestsCount, setGuestsCount] = useState(2);

  const [validationError, setValidationError] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState<{
    url: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartOpen, setIsCartOpen]);

  useEffect(() => {
    setGeneratedMessage(null);
    setValidationError('');
  }, [items, activeTab, scheduleType]);

  if (!isCartOpen) return null;

  const productMap = new Map(products.map((p) => [p.id, p]));
  const todayIso = getLocalTodayIso();

  const handleSubmitOrderNow = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (items.length === 0) {
      setValidationError('Adicione pelo menos um item ao seu carrinho.');
      return;
    }
    if (!customerName.trim()) {
      setValidationError('Informe seu nome para identificar o pedido.');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setValidationError('Informe o endereço completo para entrega.');
      return;
    }

    const result = buildWhatsAppOrder({
      whatsappNumber: restaurant.whatsappNumber,
      restaurantName: restaurant.name,
      items,
      customerName,
      customerPhone,
      deliveryType,
      address,
      paymentMethod,
      orderNotes,
      totalCents,
    });
    setGeneratedMessage(result);
  };

  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (scheduleType === 'order' && items.length === 0 && !orderNotes.trim()) {
      setValidationError(
        'Adicione pizzas ao carrinho ou descreva nas observações o que deseja agendar.'
      );
      return;
    }
    if (!scheduledDate) {
      setValidationError('Escolha a data desejada.');
      return;
    }
    if (!scheduledTime) {
      setValidationError('Escolha o horário desejado.');
      return;
    }
    if (!customerName.trim()) {
      setValidationError('Informe seu nome para confirmar o agendamento.');
      return;
    }
    if (scheduleType === 'order' && deliveryType === 'delivery' && !address.trim()) {
      setValidationError('Informe o endereço de entrega para o horário agendado.');
      return;
    }

    const result = buildWhatsAppScheduleOrder({
      whatsappNumber: restaurant.whatsappNumber,
      restaurantName: restaurant.name,
      scheduleType,
      scheduledDate,
      scheduledTime,
      guestsCount,
      items,
      totalCents,
      customerName,
      customerPhone,
      deliveryType,
      address,
      paymentMethod,
      notes: orderNotes,
    });
    setGeneratedMessage(result);
  };

  const handleCopyMessage = async () => {
    if (!generatedMessage) return;
    try {
      await navigator.clipboard.writeText(generatedMessage.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore if clipboard blocked
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0D0908]/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Carrinho e Agendamento"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg h-full bg-[#140E0C] text-[#F5EFE6] flex flex-col border-l border-[#E5A94C]/25"
      >
        {/* Drawer Header */}
        <div className="px-5 sm:px-6 pt-4 pb-3 border-b border-[#E5A94C]/18 bg-[#18110E] space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display italic text-2xl font-semibold text-[#F5EFE6]">
                Seu Carrinho
              </h2>
              <p className="text-xs text-[#BFB6AA] tabular-nums">
                {totalItems} {totalItems === 1 ? 'item selecionado' : 'itens selecionados'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-medium text-[#BFB6AA] hover:text-[#C41E24] px-2.5 py-1.5 rounded-lg cursor-pointer"
                >
                  Limpar
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Fechar carrinho"
                className="h-10 w-10 rounded-lg border border-[#E5A94C]/25 flex items-center justify-center text-[#F5EFE6] hover:bg-[#241A15] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Persistent 2-Tab Switcher: Pedir Agora | Agendar (always visible even with items in cart!) */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#0D0908] border border-[#E5A94C]/20">
            <button
              type="button"
              onClick={() => setActiveTab('order')}
              className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'order'
                  ? 'bg-[#C41E24] text-white'
                  : 'text-[#BFB6AA] hover:text-[#F5EFE6]'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Pedir Agora</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-[#E5A94C] text-[#0D0908]'
                  : 'text-[#BFB6AA] hover:text-[#F5EFE6]'
              }`}
            >
              <CalendarClock className="h-4 w-4" />
              <span>Agendar</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {/* Cart Items List (shown whenever there are items, both on Pedir Agora AND on Agendar!) */}
          {items.length > 0 ? (
            <div className="divide-y divide-[#E5A94C]/15 border border-[#E5A94C]/20 rounded-2xl bg-[#18110E] overflow-hidden">
              {items.map((item) => {
                const sourceProduct = productMap.get(item.productId);
                const canCustomize =
                  sourceProduct &&
                  (sourceProduct.isPizza ||
                    sourceProduct.sizes.length > 0 ||
                    sourceProduct.crusts.length > 0 ||
                    sourceProduct.extras.length > 0);

                return (
                  <div key={item.cartItemId} className="p-4 flex gap-3.5">
                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-[#0D0908] shrink-0">
                      <FoodImage
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#F5EFE6] leading-snug">
                          {item.secondFlavorName
                            ? `${item.productName} / ${item.secondFlavorName}`
                            : item.productName}
                        </h3>
                        <span className="text-sm font-bold text-[#E5A94C] tabular-nums whitespace-nowrap">
                          {formatBRL(item.unitPriceCents * item.quantity)}
                        </span>
                      </div>

                      <div className="mt-1 space-y-0.5 text-xs text-[#BFB6AA]">
                        {item.secondFlavorName ? (
                          <p className="text-[#E5A94C]">Pizza Meio a Meio</p>
                        ) : null}
                        {item.selectedSize ? (
                          <p>Tamanho: {item.selectedSize.label}</p>
                        ) : null}
                        {item.selectedCrust ? (
                          <p>Borda: {item.selectedCrust.label}</p>
                        ) : null}
                        {item.selectedExtras.length > 0 ? (
                          <p>
                            Extras: {item.selectedExtras.map((ex) => ex.label).join(', ')}
                          </p>
                        ) : null}
                        {item.notes ? <p>Obs.: {item.notes}</p> : null}
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center border border-[#E5A94C]/25 rounded-lg bg-[#0D0908]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            aria-label="Diminuir quantidade"
                            className="h-8 w-8 flex items-center justify-center hover:bg-[#241A15] rounded-l-lg cursor-pointer"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            aria-label="Aumentar quantidade"
                            className="h-8 w-8 flex items-center justify-center hover:bg-[#241A15] rounded-r-lg cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {canCustomize && sourceProduct ? (
                            <button
                              type="button"
                              onClick={() => onEditCartItem(sourceProduct, item)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#E5A94C] hover:text-white px-2 py-1 rounded-md cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              <span>Personalizar</span>
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => removeItem(item.cartItemId)}
                            aria-label={`Remover ${item.productName}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#BFB6AA] hover:text-[#C41E24] px-2 py-1 rounded-md cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remover</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : activeTab === 'order' ? (
            <div className="py-12 text-center bg-[#18110E] border border-[#E5A94C]/20 rounded-2xl px-6">
              <div className="mx-auto h-12 w-12 rounded-full bg-[#241A15] flex items-center justify-center text-[#E5A94C] mb-4">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <p className="font-display italic text-2xl font-semibold text-[#F5EFE6] mb-1">
                Seu carrinho está vazio
              </p>
              <p className="text-sm text-[#BFB6AA] mb-5">
                Escolha suas pizzas favoritas no cardápio ou mude para a aba{' '}
                <strong className="text-[#E5A94C]">Agendar</strong> para reservar mesa ou horário.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#C41E24] text-white text-xs sm:text-sm font-semibold hover:bg-[#D9252B] cursor-pointer"
                >
                  Explorar Cardápio
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('schedule')}
                  className="px-5 py-2.5 rounded-xl border border-[#E5A94C]/40 text-[#E5A94C] text-xs sm:text-sm font-semibold hover:bg-[#241A15] cursor-pointer"
                >
                  Ir para Agendar
                </button>
              </div>
            </div>
          ) : null}

          {/* TAB 1: PEDIR AGORA FORM */}
          {activeTab === 'order' && items.length > 0 && (
            <form id="whatsapp-checkout-form" onSubmit={handleSubmitOrderNow} className="space-y-4">
              <h3 className="text-sm font-semibold text-[#F5EFE6]">
                Dados para envio imediato no WhatsApp
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="checkout-name" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                    Seu nome *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex.: Mariana Silva"
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-phone" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                    Seu WhatsApp (opcional)
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-medium text-[#BFB6AA] mb-1.5">
                  Recebimento
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0D0908] border border-[#E5A94C]/20">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`py-2 min-h-[38px] rounded-lg text-xs font-semibold cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'bg-[#C41E24] text-white'
                        : 'text-[#BFB6AA] hover:text-white'
                    }`}
                  >
                    Entrega no endereço
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`py-2 min-h-[38px] rounded-lg text-xs font-semibold cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'bg-[#C41E24] text-white'
                        : 'text-[#BFB6AA] hover:text-white'
                    }`}
                  >
                    Retirar no balcão
                  </button>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div>
                  <label htmlFor="checkout-address" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                    Endereço de entrega *
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, complemento e bairro"
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="checkout-payment" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                    Forma de pagamento
                  </label>
                  <select
                    id="checkout-payment"
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value as 'PIX' | 'Cartão na Entrega' | 'Dinheiro'
                      )
                    }
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                  >
                    <option value="PIX">PIX</option>
                    <option value="Cartão na Entrega">Cartão na Entrega</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="checkout-notes" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                    Observações gerais
                  </label>
                  <input
                    id="checkout-notes"
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Ex.: Troco para R$ 100"
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: AGENDAR PEDIDO / RESERVA VIA WHATSAPP */}
          {activeTab === 'schedule' && (
            <form id="whatsapp-schedule-form" onSubmit={handleSubmitSchedule} className="space-y-4">
              <div className="bg-[#18110E] border border-[#E5A94C]/25 rounded-2xl p-4">
                <p className="text-xs font-semibold text-[#E5A94C] mb-1">
                  Agendamento direto pelo WhatsApp
                </p>
                <p className="text-xs text-[#BFB6AA] leading-relaxed">
                  {items.length > 0
                    ? 'Seus itens do carrinho serão incluídos automaticamente na mensagem de agendamento.'
                    : 'Escolha data e horário para agendar uma encomenda ou reservar uma mesa.'}
                </p>
              </div>

              {/* Tipo de agendamento */}
              <div>
                <span className="block text-xs font-medium text-[#BFB6AA] mb-1.5">
                  O que você deseja agendar?
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0D0908] border border-[#E5A94C]/20">
                  <button
                    type="button"
                    onClick={() => setScheduleType('order')}
                    className={`py-2 min-h-[38px] rounded-lg text-xs font-semibold cursor-pointer ${
                      scheduleType === 'order'
                        ? 'bg-[#E5A94C] text-[#0D0908]'
                        : 'text-[#BFB6AA] hover:text-white'
                    }`}
                  >
                    Entrega / Retirada
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleType('reservation')}
                    className={`py-2 min-h-[38px] rounded-lg text-xs font-semibold cursor-pointer ${
                      scheduleType === 'reservation'
                        ? 'bg-[#E5A94C] text-[#0D0908]'
                        : 'text-[#BFB6AA] hover:text-white'
                    }`}
                  >
                    Reservar Mesa
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="schedule-date" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                    Data desejada *
                  </label>
                  <input
                    id="schedule-date"
                    type="date"
                    min={todayIso}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                  />
                </div>

                <div>
                  <label htmlFor="schedule-time" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                    Horário desejado *
                  </label>
                  <input
                    id="schedule-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                  />
                </div>
              </div>

              {/* Quick Time Slots */}
              <div>
                <span className="block text-xs font-medium text-[#BFB6AA] mb-1.5">
                  Sugestões de horário
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setScheduledTime(slot)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tabular-nums border cursor-pointer ${
                        scheduledTime === slot
                          ? 'bg-[#C41E24] border-[#C41E24] text-white'
                          : 'bg-[#0D0908] border-[#E5A94C]/20 text-[#BFB6AA] hover:border-[#E5A94C]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {scheduleType === 'reservation' ? (
                <div>
                  <label htmlFor="schedule-guests" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                    Número de pessoas
                  </label>
                  <input
                    id="schedule-guests"
                    type="number"
                    min={1}
                    max={40}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] tabular-nums focus:outline-none focus:border-[#E5A94C]"
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0D0908] border border-[#E5A94C]/20">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`py-2 min-h-[38px] rounded-lg text-xs font-semibold cursor-pointer ${
                        deliveryType === 'delivery'
                          ? 'bg-[#C41E24] text-white'
                          : 'text-[#BFB6AA] hover:text-white'
                      }`}
                    >
                      Entrega agendada
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`py-2 min-h-[38px] rounded-lg text-xs font-semibold cursor-pointer ${
                        deliveryType === 'pickup'
                          ? 'bg-[#C41E24] text-white'
                          : 'text-[#BFB6AA] hover:text-white'
                      }`}
                    >
                      Retirada agendada
                    </button>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div>
                      <label htmlFor="schedule-address" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                        Endereço de entrega *
                      </label>
                      <input
                        id="schedule-address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Rua, número, complemento e bairro"
                        className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="schedule-name" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                    Seu nome *
                  </label>
                  <input
                    id="schedule-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex.: Lucas Ferreira"
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                  />
                </div>
                <div>
                  <label htmlFor="schedule-phone" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                    Seu WhatsApp (opcional)
                  </label>
                  <input
                    id="schedule-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="schedule-notes" className="block text-xs font-medium text-[#BFB6AA] mb-1">
                  Observações {items.length === 0 && scheduleType === 'order' ? '*' : '(opcional)'}
                </label>
                <input
                  id="schedule-notes"
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={
                    scheduleType === 'reservation'
                      ? 'Ex.: Mesa próxima ao forno, aniversário...'
                      : 'Ex.: Tocar interfone 24, troco para R$ 100...'
                  }
                  className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                />
              </div>
            </form>
          )}

          {validationError ? (
            <p
              role="alert"
              className="text-xs font-medium text-red-200 bg-red-950/70 border border-red-700/60 px-3.5 py-2.5 rounded-xl"
            >
              {validationError}
            </p>
          ) : null}

          {/* WhatsApp Generated Preview + Launch Link */}
          {generatedMessage && (
            <div className="p-4 rounded-2xl bg-[#18110E] text-[#F5EFE6] space-y-3 border border-[#E5A94C]/40">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#E5A94C]">
                  Mensagem pronta para o WhatsApp
                </span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center gap-1.5 text-xs text-[#BFB6AA] hover:text-white cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-xs text-[#F5EFE6]/85 whitespace-pre-wrap font-sans max-h-40 overflow-y-auto bg-[#0D0908] p-3 rounded-xl border border-[#E5A94C]/15">
                {generatedMessage.message}
              </pre>

              <a
                href={generatedMessage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-xl bg-[#25D366] text-[#0D0908] text-sm font-bold hover:brightness-105 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enviar no WhatsApp Agora</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Sticky Drawer Footer */}
        {(items.length > 0 || activeTab === 'schedule') && (
          <div className="px-5 sm:px-6 py-4 border-t border-[#E5A94C]/18 bg-[#18110E] space-y-3">
            {items.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#BFB6AA]">Total do carrinho</span>
                <span className="font-display text-2xl font-bold text-[#E5A94C] tabular-nums">
                  {formatBRL(totalCents)}
                </span>
              </div>
            )}

            {!generatedMessage && activeTab === 'order' && items.length > 0 && (
              <button
                type="submit"
                form="whatsapp-checkout-form"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl bg-[#C41E24] text-white text-sm font-semibold hover:bg-[#D9252B] transition-colors cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Finalizar Pedido via WhatsApp</span>
              </button>
            )}

            {!generatedMessage && activeTab === 'schedule' && (
              <button
                type="submit"
                form="whatsapp-schedule-form"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl bg-[#E5A94C] text-[#0D0908] text-sm font-bold hover:bg-[#EEB968] transition-colors cursor-pointer"
              >
                <CalendarClock className="h-4 w-4" />
                <span>Gerar Agendamento para WhatsApp</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
