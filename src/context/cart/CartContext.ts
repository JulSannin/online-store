import { createContext, type Dispatch, useContext } from 'react';

import { type CartAction, type CartItem } from './cartReducer';

interface CartContextValue {
    items: CartItem[];
    dispatch: Dispatch<CartAction>;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
    const cart = useContext(CartContext);

    if (!cart) {
        throw new Error('useCart вызван вне CartProvider');
    }

    return cart;
}
