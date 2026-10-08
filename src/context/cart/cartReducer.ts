import { type Product } from '@/types';

export interface CartItem {
    product: Product;
    quantity: number;
}

export type CartAction =
    | { type: 'add'; product: Product; quantity: number }
    | { type: 'increase'; id: number }
    | { type: 'decrease'; id: number };

export function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
    switch (action.type) {
        case 'add': {
            const existingItem = items.find((item) => item.product.id === action.product.id);

            if (existingItem) {
                return items.map((item) =>
                    item.product.id === action.product.id
                        ? { ...item, quantity: item.quantity + action.quantity }
                        : item,
                );
            }

            return [...items, { product: action.product, quantity: action.quantity }];
        }

        case 'increase':
            return items.map((item) =>
                item.product.id === action.id ? { ...item, quantity: item.quantity + 1 } : item,
            );

        case 'decrease':
            return items
                .map((item) =>
                    item.product.id === action.id ? { ...item, quantity: item.quantity - 1 } : item,
                )
                .filter((item) => item.quantity > 0);

        default:
            return items;
    }
}
