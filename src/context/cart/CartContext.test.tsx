import { act, renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { type Product } from '@/types';

import { useCart } from './CartContext';
import { CartProvider } from './CartProvider';
import { type CartItem } from './cartReducer';

const tomato: Product = { id: 6, name: 'Tomato', weight: '1 Kg', price: 16, image: 'tomato.jpg' };

afterEach(() => {
    vi.restoreAllMocks();
});

describe('useCart', () => {
    it('вне CartProvider бросает понятную ошибку', () => {
        // React сам пишет в консоль ошибку из рендера: глушим, чтобы не засорять вывод тестов
        vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => renderHook(() => useCart())).toThrow('useCart вызван вне CartProvider');
    });

    it('внутри CartProvider отдаёт стартовые товары, а dispatch их меняет', () => {
        const initialItems: CartItem[] = [{ product: tomato, quantity: 1 }];
        const wrapper = ({ children }: { children: ReactNode }) => (
            <CartProvider initialItems={initialItems}>{children}</CartProvider>
        );
        const { result } = renderHook(() => useCart(), { wrapper });

        expect(result.current.items).toEqual(initialItems);

        // Любое изменение состояния в тесте оборачиваем в act, чтобы React успел перерисоваться
        act(() => {
            result.current.dispatch({ type: 'increase', id: tomato.id });
        });

        expect(result.current.items).toEqual([{ product: tomato, quantity: 2 }]);
    });
});
