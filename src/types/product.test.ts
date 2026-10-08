import { describe, expect, it } from 'vitest';

import { type ApiProduct, toProduct } from './product';

// Так товар приходит с сервера: вес зашит в название, есть лишнее поле category
const apiTomato: ApiProduct = {
    id: 6,
    name: 'Tomato - 1 Kg',
    price: 16,
    image: 'tomato.jpg',
    category: 'vegetables',
};

describe('toProduct', () => {
    it('отделяет вес от названия', () => {
        const product = toProduct(apiTomato);

        expect(product.name).toBe('Tomato');
        expect(product.weight).toBe('1 Kg');
    });

    it('понимает дробный вес', () => {
        const product = toProduct({ ...apiTomato, name: 'Brocolli - 1/4 Kg' });

        expect(product.name).toBe('Brocolli');
        expect(product.weight).toBe('1/4 Kg');
    });

    it('если веса в названии нет (как у Capsicum), название остаётся целым, а weight пустым', () => {
        const product = toProduct({ ...apiTomato, name: 'Capsicum' });

        expect(product.name).toBe('Capsicum');
        expect(product.weight).toBeUndefined();
    });

    it('переносит id, цену и картинку, а category отбрасывает', () => {
        // toEqual упал бы, будь в результате лишнее поле category
        expect(toProduct(apiTomato)).toEqual({
            id: 6,
            name: 'Tomato',
            weight: '1 Kg',
            price: 16,
            image: 'tomato.jpg',
        });
    });
});
