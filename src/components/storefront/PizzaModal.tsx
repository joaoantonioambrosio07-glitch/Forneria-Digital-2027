import React, { useEffect, useMemo, useState } from 'react';
import { Check, Minus, Plus, X } from 'lucide-react';
import type { CartItem, Product, ProductOption } from '../../types/pizzeria';
import { formatBRL } from '../../lib/format';
import { FoodImage } from '../common/FoodImage';

interface PizzaModalProps {
  product: Product | null;
  allPizzas?: Product[];
  editingCartItem?: CartItem | null;
  onClose: () => void;
  onConfirm: (item: Omit<CartItem, 'cartItemId'>, editingCartItemId?: string) => void;
}

export function PizzaModal({
  product,
  allPizzas = [],
  editingCartItem,
  onClose,
  onConfirm,
}: PizzaModalProps) {
  const [selectedSize, setSelectedSize] = useState<ProductOption | null>(null);
  const [selectedCrust, setSelectedCrust] = useState<ProductOption | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<ProductOption[]>([]);
  const [isHalfAndHalf, setIsHalfAndHalf] = useState(false);
  const [secondFlavor, setSecondFlavor] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const availableSecondFlavors = useMemo(() => {
    if (!product) return [];
    return allPizzas.filter((p) => p.isPizza && p.id !== product.id && p.sizes.length > 0);
  }, [allPizzas, product]);

  useEffect(() => {
    if (!product) return;

    if (editingCartItem && editingCartItem.productId === product.id) {
      setSelectedSize(editingCartItem.selectedSize ?? product.sizes[0] ?? null);
      setSelectedCrust(editingCartItem.selectedCrust ?? product.crusts[0] ?? null);
      setSelectedExtras(editingCartItem.selectedExtras ?? []);
      setQuantity(editingCartItem.quantity);
      setNotes(editingCartItem.notes || '');
      if (editingCartItem.secondFlavorName) {
        setIsHalfAndHalf(true);
        const match = availableSecondFlavors.find(
          (p) => p.name === editingCartItem.secondFlavorName
        );
        setSecondFlavor(match ?? availableSecondFlavors[0] ?? null);
      } else {
        setIsHalfAndHalf(false);
        setSecondFlavor(null);
      }
    } else {
      const defaultSize =
        product.sizes.find((s) => s.label.toLowerCase().includes('grande')) ??
        product.sizes[0] ??
        null;
      setSelectedSize(defaultSize);
      setSelectedCrust(product.crusts[0] ?? null);
      setSelectedExtras([]);
      setIsHalfAndHalf(false);
      setSecondFlavor(availableSecondFlavors[0] ?? null);
      setQuantity(1);
      setNotes('');
    }
  }, [product, editingCartItem, availableSecondFlavors]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  const unitPriceCents = useMemo(() => {
    if (!product) return 0;
    let base = selectedSize ? selectedSize.priceCents : product.basePriceCents;

    if (isHalfAndHalf && secondFlavor && selectedSize) {
      const matchingSize = secondFlavor.sizes.find(
        (s) =>
          s.id === selectedSize.id ||
          s.label.toLowerCase() === selectedSize.label.toLowerCase()
      );
      const secondPrice = matchingSize ? matchingSize.priceCents : secondFlavor.basePriceCents;
      base = Math.max(base, secondPrice);
    }

    const crustCost = selectedCrust ? selectedCrust.priceCents : 0;
    const extrasCost = selectedExtras.reduce((sum, ex) => sum + ex.priceCents, 0);
    return base + crustCost + extrasCost;
  }, [product, selectedSize, selectedCrust, selectedExtras, isHalfAndHalf, secondFlavor]);

  if (!product) return null;

  const toggleExtra = (extra: ProductOption) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((item) => item.id === extra.id);
      if (exists) {
        return prev.filter((item) => item.id !== extra.id);
      }
      return [...prev, extra];
    });
  };

  const handleConfirm = () => {
    onConfirm(
      {
        productId: product.id,
        productName: product.name,
        secondFlavorName: isHalfAndHalf && secondFlavor ? secondFlavor.name : null,
        imageUrl: product.imageUrl,
        isPizza: product.isPizza,
        selectedSize,
        selectedCrust,
        selectedExtras,
        unitPriceCents,
        quantity,
        notes,
      },
      editingCartItem?.cartItemId
    );
    onClose();
  };

  const totalCents = unitPriceCents * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0D0908]/85 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pizza-modal-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-3xl max-h-[92vh] bg-[#18110E] text-[#F5EFE6] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col border border-[#E5A94C]/30"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes do produto"
          className="absolute top-3.5 right-3.5 z-20 h-10 w-10 rounded-full bg-[#0D0908]/85 text-[#F5EFE6] border border-[#E5A94C]/30 flex items-center justify-center hover:bg-[#C41E24] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="aspect-[16/9] sm:aspect-[21/10] w-full bg-[#0D0908] overflow-hidden">
            <FoodImage
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            <div>
              <h2
                id="pizza-modal-title"
                className="font-display italic text-3xl sm:text-4xl font-semibold text-[#F5EFE6] leading-tight mb-2"
              >
                {product.name}
              </h2>
              <p className="text-sm sm:text-base text-[#BFB6AA] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[#F5EFE6]">
                    Escolha o tamanho
                  </h3>
                  <span className="text-xs text-[#E5A94C]">Obrigatório</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {product.sizes.map((size) => {
                    const active = selectedSize?.id === size.id;
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`flex flex-col items-start justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer min-h-[62px] ${
                          active
                            ? 'bg-[#C41E24] text-white border-[#C41E24]'
                            : 'bg-[#120C0A] text-[#F5EFE6] border-[#E5A94C]/25 hover:border-[#E5A94C]'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold">{size.label}</span>
                        <span
                          className={`text-xs mt-1 tabular-nums ${
                            active ? 'text-white/95 font-bold' : 'text-[#E5A94C] font-semibold'
                          }`}
                        >
                          {formatBRL(size.priceCents)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Half and Half Option (Meio a Meio) */}
            {product.isPizza && availableSecondFlavors.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[#F5EFE6]">
                    Sabores (Inteira ou Meio a Meio)
                  </h3>
                  <span className="text-xs text-[#BFB6AA]">Prevalece o maior valor</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <button
                    type="button"
                    onClick={() => setIsHalfAndHalf(false)}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer ${
                      !isHalfAndHalf
                        ? 'bg-[#E5A94C] text-[#0D0908] border-[#E5A94C]'
                        : 'bg-[#120C0A] text-[#F5EFE6]/85 border-[#E5A94C]/25'
                    }`}
                  >
                    Pizza Inteira
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsHalfAndHalf(true);
                      if (!secondFlavor) setSecondFlavor(availableSecondFlavors[0]);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer ${
                      isHalfAndHalf
                        ? 'bg-[#E5A94C] text-[#0D0908] border-[#E5A94C]'
                        : 'bg-[#120C0A] text-[#F5EFE6]/85 border-[#E5A94C]/25'
                    }`}
                  >
                    Meio a Meio (2 Sabores)
                  </button>
                </div>

                {isHalfAndHalf && (
                  <div className="bg-[#120C0A] border border-[#E5A94C]/25 rounded-xl p-3.5">
                    <label
                      htmlFor="second-flavor-select"
                      className="block text-xs font-medium text-[#BFB6AA] mb-1.5"
                    >
                      Escolha a segunda metade:
                    </label>
                    <select
                      id="second-flavor-select"
                      value={secondFlavor?.id || ''}
                      onChange={(e) => {
                        const found = availableSecondFlavors.find(
                          (f) => f.id === e.target.value
                        );
                        setSecondFlavor(found ?? null);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#18110E] border border-[#E5A94C]/30 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
                    >
                      {availableSecondFlavors.map((flavor) => (
                        <option key={flavor.id} value={flavor.id}>
                          ½ {product.name} + ½ {flavor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Crust Options */}
            {product.crusts.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[#F5EFE6]">
                    Massa e borda
                  </h3>
                  <span className="text-xs text-[#BFB6AA]">Escolha 1 opção</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.crusts.map((crust) => {
                    const active = selectedCrust?.id === crust.id;
                    return (
                      <button
                        key={crust.id}
                        type="button"
                        onClick={() => setSelectedCrust(crust)}
                        className={`flex items-center justify-between gap-3 px-4 py-3 min-h-[48px] rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-[#261A14] border-[#E5A94C] text-[#F5EFE6]'
                            : 'bg-[#120C0A] border-[#E5A94C]/20 text-[#BFB6AA] hover:border-[#E5A94C]/50'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-medium">{crust.label}</span>
                        <span className="text-xs font-semibold text-[#E5A94C] tabular-nums whitespace-nowrap">
                          {crust.priceCents > 0 ? `+ ${formatBRL(crust.priceCents)}` : 'Inclusa'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Extra Ingredients */}
            {product.extras.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[#F5EFE6]">
                    Ingredientes extras
                  </h3>
                  <span className="text-xs text-[#BFB6AA]">Opcional</span>
                </div>

                <div className="divide-y divide-[#E5A94C]/15 border border-[#E5A94C]/20 rounded-xl bg-[#120C0A]">
                  {product.extras.map((extra) => {
                    const checked = selectedExtras.some((item) => item.id === extra.id);
                    return (
                      <button
                        key={extra.id}
                        type="button"
                        onClick={() => toggleExtra(extra)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 min-h-[48px] text-left hover:bg-[#1C1410] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                              checked
                                ? 'bg-[#C41E24] border-[#C41E24] text-white'
                                : 'bg-[#18110E] border-[#E5A94C]/40'
                            }`}
                          >
                            {checked ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
                          </span>
                          <span className="text-sm font-medium text-[#F5EFE6]">
                            {extra.label}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#E5A94C] tabular-nums whitespace-nowrap">
                          {extra.priceCents > 0 ? `+ ${formatBRL(extra.priceCents)}` : 'Cortesia'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label
                htmlFor="item-notes"
                className="block text-sm font-semibold text-[#F5EFE6] mb-2"
              >
                Observações do preparo (opcional)
              </label>
              <input
                id="item-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex.: Sem cebola, massa bem assada..."
                className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-[#120C0A] border border-[#E5A94C]/25 text-sm text-[#F5EFE6] placeholder:text-[#BFB6AA]/60 focus:outline-none focus:border-[#E5A94C]"
              />
            </div>
          </div>
        </div>

        {/* Sticky Purchase Bar */}
        <div className="border-t border-[#E5A94C]/20 bg-[#140E0C] px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center border border-[#E5A94C]/30 rounded-xl bg-[#0D0908]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Diminuir quantidade"
              className="h-11 w-11 flex items-center justify-center text-[#F5EFE6] hover:bg-[#1C1410] rounded-l-xl cursor-pointer"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-9 text-center text-sm font-bold tabular-nums text-[#F5EFE6]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Aumentar quantidade"
              className="h-11 w-11 flex items-center justify-center text-[#F5EFE6] hover:bg-[#1C1410] rounded-r-xl cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 sm:flex-initial sm:min-w-[260px] flex items-center justify-between gap-4 px-6 py-3 min-h-[46px] rounded-xl bg-[#C41E24] text-white text-sm font-semibold hover:bg-[#D9252B] transition-colors cursor-pointer"
          >
            <span>{editingCartItem ? 'Atualizar item' : 'Adicionar ao carrinho'}</span>
            <span className="tabular-nums font-bold">{formatBRL(totalCents)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
