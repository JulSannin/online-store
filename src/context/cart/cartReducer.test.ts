import { describe, expect, it } from 'vitest';

import { type Product } from '@/types';

import { cartReducer, type CartItem } from './cartReducer';

const tomato: Product = { id: 6, name: 'Tomato', weight: '1 Kg', price: 16, image: 'tomato.jpg' };

const cauliflower: Product = {
    id: 2,
    name: 'Cauliflower',
    weight: '1 Kg',
    price: 60,
    image: 'cauliflower.jpg',
};

describe('cartReducer', () => {
    it('add: новый товар появляется в корзине с нужным количеством', () => {
        const result = cartReducer([], { type: 'add', product: tomato, quantity: 3 });

        expect(result).toEqual([{ product: tomato, quantity: 3 }]);
    });

    it('add: если товар уже в корзине, количество складывается, а строка остаётся одна', () => {
        const items: CartItem[] = [{ product: tomato, quantity: 2 }];

        const result = cartReducer(items, { type: 'add', product: tomato, quantity: 3 });

        expect(result).toEqual([{ product: tomato, quantity: 5 }]);
    });

    it('add: другой товар добавляется отдельной строкой, старые не меняются', () => {
        const items: CartItem[] = [{ product: tomato, quantity: 2 }];

        const result = cartReducer(items, { type: 'add', product: cauliflower, quantity: 1 });

        expect(result).toEqual([
            { product: tomato, quantity: 2 },
            { product: cauliflower, quantity: 1 },
        ]);
    });

    it('increase: прибавляет 1 только у нужного товара', () => {
        const items: CartItem[] = [
            { product: tomato, quantity: 1 },
            { product: cauliflower, quantity: 1 },
        ];

        const result = cartReducer(items, { type: 'increase', id: cauliflower.id });

        expect(result).toEqual([
            { product: tomato, quantity: 1 },
            { product: cauliflower, quantity: 2 },
        ]);
    });

    it('decrease: убавляет 1, а строка остаётся', () => {
        const items: CartItem[] = [{ product: tomato, quantity: 2 }];

        const result = cartReducer(items, { type: 'decrease', id: tomato.id });

        expect(result).toEqual([{ product: tomato, quantity: 1 }]);
    });

    it('decrease: на последней штуке строка убирается из корзины', () => {
        const items: CartItem[] = [
            { product: tomato, quantity: 1 },
            { product: cauliflower, quantity: 1 },
        ];

        const result = cartReducer(items, { type: 'decrease', id: tomato.id });

        expect(result).toEqual([{ product: cauliflower, quantity: 1 }]);
    });

    it('не меняет переданный массив, а возвращает новый', () => {
        const items: CartItem[] = [{ product: tomato, quantity: 1 }];
        const snapshot = JSON.stringify(items);

        const result = cartReducer(items, { type: 'add', product: cauliflower, quantity: 1 });

        expect(JSON.stringify(items)).toBe(snapshot); // старый массив не тронут
        expect(result).not.toBe(items);
    });
});
