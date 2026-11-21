import React, { useEffect, useState } from 'react';
import type { CartItem, Product } from '../types/pizzeria';
import { CATEGORIES, PRODUCTS, RESTAURANT } from '../data/menuData';
import { CartProvider, useCart } from '../contexts/CartContext';
import { Header } from '../components/storefront/Header';
import { HeroSection } from '../components/storefront/HeroSection';
import { MenuSection } from '../components/storefront/MenuSection';
import { AboutSection } from '../components/storefront/AboutSection';
import { Footer } from '../components/storefront/Footer';
import { PizzaModal } from '../components/storefront/PizzaModal';
import { CartDrawer } from '../components/storefront/CartDrawer';

function StorefrontContent() {
  const { addItem, replaceItem, openCart, setIsCartOpen } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);

  useEffect(() => {
    document.title = `${RESTAURANT.name} — ${RESTAURANT.tagline} | Cardápio Digital`;
  }, []);

  const handleQuickAddProduct = (product: Product) => {
    addItem({
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      isPizza: product.isPizza,
      selectedSize: product.sizes[0] ?? null,
      selectedCrust: product.crusts[0] ?? null,
      selectedExtras: [],
      unitPriceCents: product.sizes[0]?.priceCents ?? product.basePriceCents,
      quantity: 1,
      notes: '',
    });
    openCart('order');
  };

  const handleConfirmModal = (
    item: Omit<CartItem, 'cartItemId'>,
    editingCartItemId?: string
  ) => {
    if (editingCartItemId) {
      replaceItem(editingCartItemId, item);
      openCart('order');
    } else {
      addItem(item);
      openCart('order');
    }
    setEditingCartItem(null);
  };

  const handleEditCartItem = (product: Product, cartItem: CartItem) => {
    setIsCartOpen(false);
    setEditingCartItem(cartItem);
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0908]">
      <Header restaurant={RESTAURANT} />

      <main className="flex-1">
        <HeroSection restaurant={RESTAURANT} />
        <MenuSection
          categories={CATEGORIES}
          products={PRODUCTS}
          onSelectProduct={(p) => {
            setEditingCartItem(null);
            setSelectedProduct(p);
          }}
          onQuickAddProduct={handleQuickAddProduct}
        />
        <AboutSection restaurant={RESTAURANT} />
      </main>

      <Footer restaurant={RESTAURANT} />

      <PizzaModal
        product={selectedProduct}
        allPizzas={PRODUCTS}
        editingCartItem={editingCartItem}
        onClose={() => {
          setSelectedProduct(null);
          setEditingCartItem(null);
        }}
        onConfirm={handleConfirmModal}
      />

      <CartDrawer
        restaurant={RESTAURANT}
        products={PRODUCTS}
        onEditCartItem={handleEditCartItem}
      />
    </div>
  );
}

export function StorefrontPage() {
  return (
    <CartProvider restaurantSlug={RESTAURANT.slug}>
      <StorefrontContent />
    </CartProvider>
  );
}
