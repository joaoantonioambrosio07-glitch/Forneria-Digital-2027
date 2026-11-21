import type { CartItem } from '../types/pizzeria';

export function formatBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format((cents || 0) / 100);
}

export function formatInputDateBR(yyyyMmDd: string): string {
  if (!yyyyMmDd) return '—';
  const [y, m, d] = yyyyMmDd.split('-');
  if (!y || !m || !d) return yyyyMmDd;
  return `${d}/${m}/${y}`;
}

function normalizeWhatsApp(whatsappNumber: string): string {
  const digits = whatsappNumber.replace(/\D/g, '');
  return digits.startsWith('55') || digits.length >= 12 ? digits : `55${digits}`;
}

function formatCartItemLines(items: CartItem[]): string[] {
  const lines: string[] = [];
  items.forEach((item, index) => {
    const itemSubtotal = item.unitPriceCents * item.quantity;
    const title = item.secondFlavorName
      ? `${item.productName} / ${item.secondFlavorName} (Meio a Meio)`
      : item.productName;

    lines.push(`${index + 1}. *${item.quantity}x ${title}* — ${formatBRL(itemSubtotal)}`);
    if (item.selectedSize) {
      lines.push(`   • Tamanho: ${item.selectedSize.label}`);
    }
    if (item.selectedCrust) {
      lines.push(
        `   • Borda: ${item.selectedCrust.label}${
          item.selectedCrust.priceCents > 0
            ? ` (+${formatBRL(item.selectedCrust.priceCents)})`
            : ''
        }`
      );
    }
    if (item.selectedExtras.length > 0) {
      const extrasText = item.selectedExtras
        .map((e) => `${e.label}${e.priceCents > 0 ? ` (+${formatBRL(e.priceCents)})` : ''}`)
        .join(', ');
      lines.push(`   • Extras: ${extrasText}`);
    }
    if (item.notes.trim()) {
      lines.push(`   • Obs.: ${item.notes.trim()}`);
    }
  });
  return lines;
}

export interface WhatsAppCheckoutDetails {
  whatsappNumber: string;
  restaurantName: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  address: string;
  paymentMethod: 'PIX' | 'Cartão na Entrega' | 'Dinheiro';
  orderNotes: string;
  totalCents: number;
}

export function buildWhatsAppOrder(details: WhatsAppCheckoutDetails): {
  url: string;
  message: string;
} {
  const normalizedPhone = normalizeWhatsApp(details.whatsappNumber);

  const lines: string[] = [
    `*NOVO PEDIDO — ${details.restaurantName.toUpperCase()}*`,
    '',
    '*Itens do Pedido:*',
    ...formatCartItemLines(details.items),
    '',
    `*Total do Pedido: ${formatBRL(details.totalCents)}*`,
    '',
    '*Dados do Cliente:*',
    `• Nome: ${details.customerName.trim()}`,
  ];

  if (details.customerPhone.trim()) {
    lines.push(`• Telefone: ${details.customerPhone.trim()}`);
  }
  lines.push(
    `• Recebimento: ${
      details.deliveryType === 'delivery'
        ? `Entrega (${details.address.trim()})`
        : 'Retirada no balcão'
    }`
  );
  lines.push(`• Pagamento: ${details.paymentMethod}`);
  if (details.orderNotes.trim()) {
    lines.push(`• Observações gerais: ${details.orderNotes.trim()}`);
  }

  const message = lines.join('\n');
  const url = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
  return { url, message };
}

export interface WhatsAppScheduleDetails {
  whatsappNumber: string;
  restaurantName: string;
  scheduleType: 'order' | 'reservation';
  scheduledDate: string;
  scheduledTime: string;
  guestsCount: number;
  items: CartItem[];
  totalCents: number;
  customerName: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  address: string;
  paymentMethod: 'PIX' | 'Cartão na Entrega' | 'Dinheiro';
  notes: string;
}

export function buildWhatsAppScheduleOrder(details: WhatsAppScheduleDetails): {
  url: string;
  message: string;
} {
  const normalizedPhone = normalizeWhatsApp(details.whatsappNumber);
  const formattedDate = formatInputDateBR(details.scheduledDate);

  const lines: string[] = [
    details.scheduleType === 'reservation'
      ? `*AGENDAMENTO DE MESA — ${details.restaurantName.toUpperCase()}*`
      : `*PEDIDO AGENDADO — ${details.restaurantName.toUpperCase()}*`,
    '',
    `*Data desejada:* ${formattedDate}`,
    `*Horário:* ${details.scheduledTime}`,
  ];

  if (details.scheduleType === 'reservation') {
    lines.push(`*Quantidade de pessoas:* ${details.guestsCount}`);
  }

  if (details.items.length > 0) {
    lines.push('');
    lines.push('*Itens Selecionados no Carrinho:*');
    lines.push(...formatCartItemLines(details.items));
    lines.push('');
    lines.push(`*Total Previsto: ${formatBRL(details.totalCents)}*`);
  }

  lines.push('');
  lines.push('*Dados para Confirmação:*');
  lines.push(`• Nome: ${details.customerName.trim()}`);
  if (details.customerPhone.trim()) {
    lines.push(`• WhatsApp: ${details.customerPhone.trim()}`);
  }

  if (details.scheduleType === 'order') {
    lines.push(
      `• Recebimento: ${
        details.deliveryType === 'delivery'
          ? `Entrega (${details.address.trim()})`
          : 'Retirada no balcão'
      }`
    );
    lines.push(`• Pagamento: ${details.paymentMethod}`);
  }

  if (details.notes.trim()) {
    lines.push(`• Observações: ${details.notes.trim()}`);
  }

  const message = lines.join('\n');
  const url = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
  return { url, message };
}
