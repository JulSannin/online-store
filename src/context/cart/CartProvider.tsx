import { type ReactNode, useReducer } from 'react';

import { CartContext } from './CartContext';
import { cartReducer, type CartItem } from './cartReducer';

interface Props {
    children: ReactNode;
    initialItems?: CartItem[];
}

export function CartProvider({ children, initialItems = [] }: Props) {
    const [items, dispatch] = useReducer(cartReducer, initialItems);
    return <CartContext.Provider value={{ items, dispatch }}>{children}</CartContext.Provider>;
}
