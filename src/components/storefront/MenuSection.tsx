import React, { useEffect, useMemo, useState } from 'react';
import {
  CakeSlice,
  CupSoda,
  Flame,
  Gift,
  Pizza,
  Search,
  ShoppingCart,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import type { Category, Product } from '../../types/pizzeria';
import { formatBRL } from '../../lib/format';
import { FoodImage } from '../common/FoodImage';

interface MenuSectionProps {
  categories: Category[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAddProduct: (product: Product) => void;
}

function getCategoryIcon(slug: string, name: string) {
  const key = `${slug} ${name}`.toLowerCase();
  if (key.includes('doce')) return CakeSlice;
  if (key.includes('bebida')) return CupSoda;
  if (key.includes('sobremesa')) return Sparkles;
  if (key.includes('combo')) return Gift;
  if (key.includes('especia')) return Flame;
  return Pizza;
}

export function MenuSection({
  categories,
  products,
  onSelectProduct,
  onQuickAddProduct,
}: MenuSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id || 'all'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');

  useEffect(() => {
    if (activeCategoryId !== 'all' && !categories.some((c) => c.id === activeCategoryId)) {
      setActiveCategoryId(categories[0]?.id || 'all');
    }
  }, [categories, activeCategoryId]);

  const getMinPriceCents = (product: Product) => {
    if (product.sizes.length > 0) {
      return Math.min(...product.sizes.map((s) => s.priceCents));
    }
    return product.basePriceCents;
  };

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const list = products.filter((p) => {
      if (!query && activeCategoryId !== 'all' && p.categoryId !== activeCategoryId) {
        return false;
      }
      if (onlyFeatured && !p.isFeatured) {
        return false;
      }
      if (query) {
        return (
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }
      return true;
    });

    if (sortBy === 'price_asc') {
      return [...list].sort((a, b) => getMinPriceCents(a) - getMinPriceCents(b));
    }
    if (sortBy === 'price_desc') {
      return [...list].sort((a, b) => getMinPriceCents(b) - getMinPriceCents(a));
    }
    return list;
  }, [products, activeCategoryId, searchTerm, onlyFeatured, sortBy]);

  const categoryNameMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <section
      id="cardapio"
      className="bg-gradient-to-b from-[#230C0A] via-[#120B09] to-[#0D0908] text-[#F5EFE6] py-14 sm:py-20 scroll-mt-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Centered Editorial Title */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-2">
            <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#E5A94C]/70" />
            <h2 className="font-display italic text-3xl sm:text-5xl font-semibold text-[#F5EFE6] tracking-tight">
              Nossas Pizzas
            </h2>
            <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#E5A94C]/70" />
          </div>
          <p className="text-sm sm:text-base text-[#BFB6AA]">
            Descubra nossas opções mais pedidas
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start lg:justify-center gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveCategoryId('all')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeCategoryId === 'all'
                ? 'bg-[#C41E24] text-white border border-[#C41E24]'
                : 'bg-[#19120F] text-[#F5EFE6]/85 border border-[#E5A94C]/30 hover:border-[#E5A94C]'
            }`}
          >
            <UtensilsCrossed className="h-3.5 w-3.5 text-[#E5A94C]" />
            <span>Todas</span>
          </button>

          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug, cat.name);
            const active = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#C41E24] text-white border border-[#C41E24]'
                    : 'bg-[#19120F] text-[#F5EFE6]/85 border border-[#E5A94C]/30 hover:border-[#E5A94C]'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-[#E5A94C]'}`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Digital Menu Controls: Search, Popular Filter, Price Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 bg-[#160F0D] border border-[#E5A94C]/18 rounded-2xl p-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#BFB6AA]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar sabor, ingrediente ou bebida..."
              aria-label="Buscar no cardápio"
              className="w-full pl-10 pr-4 py-2 min-h-[40px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/20 text-sm text-[#F5EFE6] placeholder:text-[#BFB6AA]/60 focus:outline-none focus:border-[#E5A94C]"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setOnlyFeatured((v) => !v)}
              className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold border whitespace-nowrap transition-colors cursor-pointer ${
                onlyFeatured
                  ? 'bg-[#E5A94C] text-[#0D0908] border-[#E5A94C]'
                  : 'bg-[#0D0908] text-[#F5EFE6]/85 border-[#E5A94C]/20 hover:border-[#E5A94C]/50'
              }`}
            >
              Mais Pedidas
            </button>

            <select
              aria-label="Ordenar produtos"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'default' | 'price_asc' | 'price_desc')
              }
              className="px-3.5 py-2 min-h-[40px] rounded-xl bg-[#0D0908] border border-[#E5A94C]/20 text-xs font-medium text-[#F5EFE6] focus:outline-none focus:border-[#E5A94C]"
            >
              <option value="default">Ordem do cardápio</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
            </select>
          </div>
        </div>

        {/* 4-Column Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-14 text-center bg-[#160F0D] border border-[#E5A94C]/20 rounded-2xl px-6">
            <p className="font-display text-2xl font-semibold text-[#F5EFE6] mb-2">
              Nenhum sabor encontrado
            </p>
            <p className="text-sm text-[#BFB6AA] mb-5">
              Tente limpar os filtros ou selecionar outra categoria do cardápio.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setOnlyFeatured(false);
                setActiveCategoryId('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#C41E24] text-white text-sm font-semibold hover:bg-[#D9252B] transition-colors cursor-pointer"
            >
              Mostrar todo o cardápio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => {
              const minPrice = getMinPriceCents(product);
              const hasOptions =
                product.isPizza ||
                product.sizes.length > 0 ||
                product.crusts.length > 0 ||
                product.extras.length > 0;
              const catName = categoryNameMap.get(product.categoryId) || '';

              return (
                <article
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group flex flex-col bg-[#18110E] border border-[#E5A94C]/22 rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:border-[#E5A94C]/60 transition-all duration-200 cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#0D0908]">
                    <FoodImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    />
                  </div>

                  <div className="flex flex-col flex-1 p-4 sm:p-5">
                    {searchTerm || activeCategoryId === 'all' ? (
                      <p className="text-[11px] font-medium text-[#E5A94C]/85 mb-1">
                        {catName}
                      </p>
                    ) : null}

                    <h3 className="text-lg font-semibold text-[#F5EFE6] leading-snug mb-1.5">
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#BFB6AA] leading-relaxed line-clamp-2 mb-4 flex-1">
                      {product.description}
                    </p>

                    <div className="mb-3.5 text-sm">
                      {product.sizes.length > 0 ? (
                        <span className="text-[#BFB6AA]">A partir de </span>
                      ) : null}
                      <span className="font-bold text-[#E5A94C] tabular-nums text-base">
                        {formatBRL(minPrice)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hasOptions) {
                          onSelectProduct(product);
                        } else {
                          onQuickAddProduct(product);
                        }
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl bg-[#C41E24] text-white text-xs sm:text-sm font-semibold hover:bg-[#D9252B] transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4 shrink-0" />
                      <span>Adicionar ao Carrinho</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
