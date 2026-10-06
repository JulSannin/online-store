import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ProductCard } from '@/components/ProductCard/ProductCard';
import { type Product } from '@/types/product';

const product: Product = {
    id: 6,
    name: 'Tomato',
    weight: '1 Kg',
    price: 16,
    image: 'tomato.jpg',
};

function renderCard() {
    return render(
        <MantineProvider env="test">
            <ProductCard product={product} />
        </MantineProvider>,
    );
}

describe('ProductCard', () => {
    it('показывает название, вес и цену за одну штуку', () => {
        renderCard();

        expect(screen.getByText('Tomato')).toBeInTheDocument();
        expect(screen.getByText('1 Kg')).toBeInTheDocument();
        expect(screen.getByText('$ 16')).toBeInTheDocument();
    });

    it('кнопки + и - меняют число, а цена считается за выбранное количество', async () => {
        const user = userEvent.setup();
        renderCard();

        const quantity = screen.getByRole('textbox', { name: 'Количество' });
        expect(quantity).toHaveValue('1');

        await user.click(screen.getByRole('button', { name: 'Увеличить количество' }));
        await user.click(screen.getByRole('button', { name: 'Увеличить количество' }));

        expect(quantity).toHaveValue('3');
        expect(screen.getByText('$ 48')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Уменьшить количество' }));

        expect(quantity).toHaveValue('2');
        expect(screen.getByText('$ 32')).toBeInTheDocument();
    });

    it('на единице кнопка - выключена, а после увеличения снова работает', async () => {
        const user = userEvent.setup();
        renderCard();

        const minus = screen.getByRole('button', { name: 'Уменьшить количество' });
        expect(minus).toBeDisabled();

        await user.click(screen.getByRole('button', { name: 'Увеличить количество' }));

        expect(minus).toBeEnabled();
    });
});
