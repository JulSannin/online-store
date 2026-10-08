import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { type CartItem } from '@/context/cart';
import { renderWithProviders } from '@/test/renderWithProviders';
import { type Product } from '@/types';

import { CartPopover } from './CartPopover';

const tomato: Product = { id: 6, name: 'Tomato', weight: '1 Kg', price: 16, image: 'tomato.jpg' };
const cauliflower: Product = {
    id: 2,
    name: 'Cauliflower',
    weight: '1 Kg',
    price: 60,
    image: 'cauliflower.jpg',
};

// 2 помидора по 16 и 1 капуста за 60: итог 92
const items: CartItem[] = [
    { product: tomato, quantity: 2 },
    { product: cauliflower, quantity: 1 },
];

// Строка корзины по номеру: within ищет кнопки только внутри неё
function row(index: number) {
    return within(screen.getAllByRole('listitem')[index]!);
}

function total() {
    return screen.getByText('Total').parentElement;
}

describe('CartPopover', () => {
    it('пока корзина пуста, показывает подпись с иллюстрацией, без списка и итога', () => {
        renderWithProviders(<CartPopover />);

        expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
        // У иллюстрации пустой alt, поэтому роль у неё presentation, а не img
        expect(screen.getByRole('presentation')).toHaveAttribute(
            'src',
            expect.stringContaining('cart_empty'),
        );
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
        expect(screen.queryByText('Total')).not.toBeInTheDocument();
    });

    it('показывает строки с ценой за выбранное количество и итог', () => {
        renderWithProviders(<CartPopover />, { items });

        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(row(0).getByText('Tomato')).toBeInTheDocument();
        expect(row(0).getByText('$ 32')).toBeInTheDocument();
        expect(row(1).getByText('$ 60')).toBeInTheDocument();
        expect(total()).toHaveTextContent('$ 92');
    });

    it('+ увеличивает количество, итог пересчитывается', async () => {
        const user = userEvent.setup();
        renderWithProviders(<CartPopover />, { items });

        await user.click(row(0).getByRole('button', { name: 'Увеличить количество' }));

        expect(row(0).getByRole('textbox', { name: 'Количество' })).toHaveValue('3');
        expect(row(0).getByText('$ 48')).toBeInTheDocument();
        expect(total()).toHaveTextContent('$ 108');
    });

    it('− уменьшает количество, а на последней штуке убирает строку', async () => {
        const user = userEvent.setup();
        renderWithProviders(<CartPopover />, { items });

        await user.click(row(0).getByRole('button', { name: 'Уменьшить количество' }));
        expect(row(0).getByRole('textbox', { name: 'Количество' })).toHaveValue('1');
        expect(total()).toHaveTextContent('$ 76');

        await user.click(row(1).getByRole('button', { name: 'Уменьшить количество' }));
        expect(screen.getAllByRole('listitem')).toHaveLength(1);
        expect(total()).toHaveTextContent('$ 16');

        await user.click(row(0).getByRole('button', { name: 'Уменьшить количество' }));
        expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
    });
});
