import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { type CartItem } from '@/context/cart';
import { renderWithProviders } from '@/test/renderWithProviders';
import { type Product } from '@/types';

import { Header } from './Header';

const tomato: Product = { id: 6, name: 'Tomato', weight: '1 Kg', price: 16, image: 'tomato.jpg' };
const cauliflower: Product = {
    id: 2,
    name: 'Cauliflower',
    weight: '1 Kg',
    price: 60,
    image: 'cauliflower.jpg',
};

// 2 помидора и 1 капуста: на кнопке 3 — это сумма штук, а не число строк
const items: CartItem[] = [
    { product: tomato, quantity: 2 },
    { product: cauliflower, quantity: 1 },
];

describe('Header', () => {
    it('отображает название магазина', () => {
        renderWithProviders(<Header />);

        expect(screen.getByRole('heading', { name: /vegetable shop/i })).toBeInTheDocument();
    });

    it('не показывает счётчик, пока корзина пуста', () => {
        renderWithProviders(<Header />);

        // getBy бросает ошибку, если не нашёл; queryBy возвращает null — его и используем,
        // когда проверяем, что чего-то НЕТ на странице
        expect(screen.queryByText('3')).not.toBeInTheDocument();
    });

    it('показывает на кнопке общее количество штук', () => {
        renderWithProviders(<Header />, { items });

        expect(screen.getByText('3')).toBeInTheDocument();
    });

    // Слово «Cart» на мобильном скрыто, поэтому имя кнопки задаёт aria-label
    it('у кнопки есть имя «Cart», а при непустой корзине ещё и количество', () => {
        const { unmount } = renderWithProviders(<Header />);
        expect(screen.getByRole('button', { name: 'Cart' })).toBeInTheDocument();
        unmount();

        renderWithProviders(<Header />, { items });
        expect(screen.getByRole('button', { name: 'Cart, 3' })).toBeInTheDocument();
    });

    it('открывает корзину по клику на кнопку', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Header />);

        // до клика popover закрыт
        expect(screen.queryByText(/cart is empty/i)).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /cart/i }));

        expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
    });

    it('в открытой корзине видны товары и итог', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Header />, { items });

        await user.click(screen.getByRole('button', { name: /cart/i }));

        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(screen.getByText('Total').parentElement).toHaveTextContent('$ 92');
    });
});
