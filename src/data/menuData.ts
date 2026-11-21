import type { Category, Product, ProductOption, Restaurant } from '../types/pizzeria';
import heroPizzaImg from '../assets/images/hero_artisanal_pizza_1795118287638.webp';
import pepperoniPizzaImg from '../assets/images/pizza_pepperoni_hot_honey_1795118288479.webp';
import truffleFunghiImg from '../assets/images/pizza_truffle_funghi_1795118288878.webp';
import pistachioChocoImg from '../assets/images/pizza_pistachio_chocolate_1795118287979.webp';
import italianSodaImg from '../assets/images/beverage_italian_soda_1795118288721.webp';
import tiramisuImg from '../assets/images/dessert_tiramisu_classic_1795118288166.webp';

export const RESTAURANT: Restaurant = {
  slug: 'pizza-bella',
  name: 'Pizza Bella',
  tagline: 'TRADIÇÃO EM CADA FATIA',
  description:
    'Pizzas artesanais, ingredientes selecionados e muito mais sabor para você!',
  aboutTitle: 'Sobre Nós',
  aboutText:
    'Somos apaixonados por pizza! Aqui, cada receita é preparada com ingredientes de alta qualidade, fermentação natural lenta, muito amor e o verdadeiro sabor da Itália.',
  logoUrl: '',
  coverImageUrl: heroPizzaImg,
  whatsappNumber: '5511987654321',
  address: 'Rua das Pizzas, 123 — Centro, São Paulo - SP',
  openingHours: 'Seg a Dom: 18h às 23h',
  instagramUrl: 'https://instagram.com/pizzabella',
};

export const CATEGORIES: Category[] = [
  {
    id: 'cat-tradicionais',
    name: 'Tradicionais',
    slug: 'tradicionais',
    description:
      'Clássicas assadas no forno a lenha com molho de tomate pelati e mussarela selecionada.',
    sortOrder: 1,
  },
  {
    id: 'cat-especiais',
    name: 'Especiais',
    slug: 'especiais',
    description:
      'Criações autorais com trufas negras, cogumelos frescos e curados nobres.',
    sortOrder: 2,
  },
  {
    id: 'cat-doces',
    name: 'Doces',
    slug: 'doces',
    description:
      'Sobremesas em disco assado na hora com chocolate belga e frutas frescas.',
    sortOrder: 3,
  },
  {
    id: 'cat-bebidas',
    name: 'Bebidas',
    slug: 'bebidas',
    description: 'Sodas italianas artesanais, sucos naturais e refrigerantes gelados.',
    sortOrder: 4,
  },
  {
    id: 'cat-sobremesas',
    name: 'Sobremesas',
    slug: 'sobremesas',
    description: 'Clássicos da confeitaria italiana preparados diariamente na casa.',
    sortOrder: 5,
  },
  {
    id: 'cat-combos',
    name: 'Combos',
    slug: 'combos',
    description: 'Combinações especiais para compartilhar com a família e amigos.',
    sortOrder: 6,
  },
];

const STANDARD_CRUSTS: ProductOption[] = [
  { id: 'crust-trad', label: 'Massa Tradicional Artesanal', priceCents: 0 },
  { id: 'crust-catupiry', label: 'Borda Recheada Catupiry Original', priceCents: 1200 },
  { id: 'crust-cheddar', label: 'Borda Recheada Cheddar Cremoso', priceCents: 1200 },
  { id: 'crust-gergelim', label: 'Borda com Gergelim Tostado', priceCents: 500 },
];

const STANDARD_EXTRAS: ProductOption[] = [
  { id: 'extra-burrata', label: 'Burrata Fresca Cremosa', priceCents: 1800 },
  { id: 'extra-pepperoni', label: 'Calabresa / Pepperoni Extra', priceCents: 1200 },
  { id: 'extra-azeitonas', label: 'Azeitonas Pretas Azapa', priceCents: 600 },
  { id: 'extra-rucula', label: 'Rúcula Fresca Selecionada', priceCents: 600 },
  { id: 'extra-parmesao', label: 'Parmesão Ralado na Hora', priceCents: 900 },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-marguerita',
    categoryId: 'cat-tradicionais',
    name: 'Marguerita',
    description:
      'Molho de tomate pelati, mussarela fresca e folhas de manjericão doce.',
    imageUrl: heroPizzaImg,
    basePriceCents: 3990,
    isPizza: true,
    isFeatured: true,
    sizes: [
      { id: 'size-p', label: 'Broto (4 fatias)', priceCents: 3990 },
      { id: 'size-m', label: 'Média (6 fatias)', priceCents: 5290 },
      { id: 'size-g', label: 'Grande (8 fatias)', priceCents: 6490 },
      { id: 'size-f', label: 'Família (12 fatias)', priceCents: 8290 },
    ],
    crusts: STANDARD_CRUSTS,
    extras: STANDARD_EXTRAS,
  },
  {
    id: 'prod-calabresa',
    categoryId: 'cat-tradicionais',
    name: 'Calabresa Especial',
    description:
      'Molho de tomate, mussarela, calabresa artesanal fatiada e cebola roxa.',
    imageUrl: pepperoniPizzaImg,
    basePriceCents: 4490,
    isPizza: true,
    isFeatured: true,
    sizes: [
      { id: 'size-p', label: 'Broto (4 fatias)', priceCents: 4490 },
      { id: 'size-m', label: 'Média (6 fatias)', priceCents: 5790 },
      { id: 'size-g', label: 'Grande (8 fatias)', priceCents: 6990 },
      { id: 'size-f', label: 'Família (12 fatias)', priceCents: 8790 },
    ],
    crusts: STANDARD_CRUSTS,
    extras: STANDARD_EXTRAS,
  },
  {
    id: 'prod-quatro-queijos',
    categoryId: 'cat-tradicionais',
    name: 'Quatro Queijos',
    description:
      'Mussarela, provolone defumado, parmesão maturado e gorgonzola cremoso.',
    imageUrl: truffleFunghiImg,
    basePriceCents: 4990,
    isPizza: true,
    isFeatured: true,
    sizes: [
      { id: 'size-p', label: 'Broto (4 fatias)', priceCents: 4990 },
      { id: 'size-m', label: 'Média (6 fatias)', priceCents: 6290 },
      { id: 'size-g', label: 'Grande (8 fatias)', priceCents: 7490 },
      { id: 'size-f', label: 'Família (12 fatias)', priceCents: 9290 },
    ],
    crusts: STANDARD_CRUSTS,
    extras: STANDARD_EXTRAS,
  },
  {
    id: 'prod-vegetariana',
    categoryId: 'cat-tradicionais',
    name: 'Vegetariana',
    description:
      'Molho de tomate, mussarela, tomate cereja assado, azeitonas pretas e rúcula fresca.',
    imageUrl: heroPizzaImg,
    basePriceCents: 4290,
    isPizza: true,
    isFeatured: true,
    sizes: [
      { id: 'size-p', label: 'Broto (4 fatias)', priceCents: 4290 },
      { id: 'size-m', label: 'Média (6 fatias)', priceCents: 5590 },
      { id: 'size-g', label: 'Grande (8 fatias)', priceCents: 6790 },
      { id: 'size-f', label: 'Família (12 fatias)', priceCents: 8490 },
    ],
    crusts: STANDARD_CRUSTS,
    extras: STANDARD_EXTRAS,
  },
  {
    id: 'prod-tartufata',
    categoryId: 'cat-especiais',
    name: 'Tartufata & Funghi',
    description:
      'Base branca com fior di latte, cogumelos porcini salteados, lâminas de trufa negra e tomilho.',
    imageUrl: truffleFunghiImg,
    basePriceCents: 6490,
    isPizza: true,
    isFeatured: true,
    sizes: [
      { id: 'size-m', label: 'Média (6 fatias)', priceCents: 6490 },
      { id: 'size-g', label: 'Grande (8 fatias)', priceCents: 8290 },
      { id: 'size-f', label: 'Família (12 fatias)', priceCents: 9990 },
    ],
    crusts: STANDARD_CRUSTS,
    extras: STANDARD_EXTRAS,
  },
  {
    id: 'prod-pepperoni-mel',
    categoryId: 'cat-especiais',
    name: 'Pepperoni & Mel Picante',
    description:
      'Pepperoni americano crocante, mussarela especial, orégano fresco e mel de pimenta.',
    imageUrl: pepperoniPizzaImg,
    basePriceCents: 5990,
    isPizza: true,
    isFeatured: false,
    sizes: [
      { id: 'size-m', label: 'Média (6 fatias)', priceCents: 5990 },
      { id: 'size-g', label: 'Grande (8 fatias)', priceCents: 7690 },
      { id: 'size-f', label: 'Família (12 fatias)', priceCents: 9490 },
    ],
    crusts: STANDARD_CRUSTS,
    extras: STANDARD_EXTRAS,
  },
  {
    id: 'prod-pistache',
    categoryId: 'cat-doces',
    name: 'Chocolate Belga & Pistache',
    description:
      'Ganache cremosa de chocolate belga 54%, morangos frescos fatiados e pistache tostado.',
    imageUrl: pistachioChocoImg,
    basePriceCents: 5490,
    isPizza: true,
    isFeatured: false,
    sizes: [
      { id: 'size-m', label: 'Média (6 fatias)', priceCents: 5490 },
      { id: 'size-g', label: 'Grande (8 fatias)', priceCents: 6890 },
    ],
    crusts: [
      { id: 'crust-trad', label: 'Massa Tradicional Assada', priceCents: 0 },
      { id: 'crust-avela', label: 'Borda Recheada Creme de Avelã', priceCents: 1400 },
    ],
    extras: [
      { id: 'extra-pistache', label: 'Pistache Extra Granulado', priceCents: 1200 },
      { id: 'extra-morango', label: 'Morangos Frescos Extra', priceCents: 800 },
    ],
  },
  {
    id: 'prod-soda',
    categoryId: 'cat-bebidas',
    name: 'Soda Italiana Arancia Rossa',
    description:
      'Xarope artesanal de laranja sanguínea, água gaseificada e ramo de alecrim fresco (350ml).',
    imageUrl: italianSodaImg,
    basePriceCents: 1690,
    isPizza: false,
    isFeatured: false,
    sizes: [],
    crusts: [],
    extras: [
      { id: 'extra-gelo-limao', label: 'Rodela Extra de Limão Siciliano', priceCents: 0 },
    ],
  },
  {
    id: 'prod-tiramisu',
    categoryId: 'cat-sobremesas',
    name: 'Tiramisù della Casa',
    description:
      'Biscoitos savoiardi no espresso italiano, creme de mascarpone fresco e cacau holandês.',
    imageUrl: tiramisuImg,
    basePriceCents: 2890,
    isPizza: false,
    isFeatured: false,
    sizes: [],
    crusts: [],
    extras: [],
  },
  {
    id: 'prod-combo-familia',
    categoryId: 'cat-combos',
    name: 'Combo Bella Famiglia',
    description:
      '1 Pizza Grande Tradicional + 1 Pizza Média Doce ou Tiramisù + 2 Sodas Italianas.',
    imageUrl: pepperoniPizzaImg,
    basePriceCents: 11990,
    isPizza: true,
    isFeatured: true,
    sizes: [
      { id: 'size-combo-trad', label: 'Com Pizza Tradicional Grande', priceCents: 11990 },
      { id: 'size-combo-esp', label: 'Com Pizza Especial Grande', priceCents: 13490 },
    ],
    crusts: STANDARD_CRUSTS,
    extras: STANDARD_EXTRAS,
  },
];
