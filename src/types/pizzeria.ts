export interface ProductOption {
  id: string;
  label: string;
  priceCents: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  basePriceCents: number;
  isPizza: boolean;
  isFeatured: boolean;
  sizes: ProductOption[];
  crusts: ProductOption[];
  extras: ProductOption[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export interface Restaurant {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  aboutTitle: string;
  aboutText: string;
  logoUrl: string;
  coverImageUrl: string;
  whatsappNumber: string;
  address: string;
  openingHours: string;
  instagramUrl: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  secondFlavorName?: string | null;
  imageUrl: string;
  isPizza: boolean;
  selectedSize: ProductOption | null;
  selectedCrust: ProductOption | null;
  selectedExtras: ProductOption[];
  unitPriceCents: number;
  quantity: number;
  notes: string;
}
