import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Header } from '@/modules/';

// env="test" отключает анимации и порталы Mantine — иначе popover сложно найти
function renderHeader(countProducts: number) {
    return render(
        <MantineProvider env="test">
            <Header countProducts={countProducts} />
        </MantineProvider>,
    );
}

describe('Header', () => {
    it('отображает название магазина', () => {
        renderHeader(0);

        expect(screen.getByRole('heading', { name: /vegetable shop/i })).toBeInTheDocument();
    });

    it('не показывает счётчик, пока корзина пуста', () => {
        renderHeader(0);

        // getBy бросает ошибку, если не нашёл; queryBy возвращает null — его и используем,
        // когда проверяем, что чего-то НЕТ на странице
        expect(screen.queryByText('2')).not.toBeInTheDocument();
    });

    it('показывает количество товаров на кнопке', () => {
        renderHeader(2);

        expect(screen.getByText('2')).toBeInTheDocument();
    });

    // Слово «Cart» на мобильном скрыто, поэтому имя кнопки задаёт aria-label
    it('у кнопки есть имя «Cart», а при непустой корзине ещё и количество', () => {
        const { unmount } = renderHeader(0);
        expect(screen.getByRole('button', { name: 'Cart' })).toBeInTheDocument();
        unmount();

        renderHeader(2);
        expect(screen.getByRole('button', { name: 'Cart, 2' })).toBeInTheDocument();
    });

    it('открывает корзину по клику на кнопку', async () => {
        const user = userEvent.setup();
        renderHeader(0);

        // до клика popover закрыт
        expect(screen.queryByText('Корзина пуста')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /cart/i }));

        expect(screen.getByText('Корзина пуста')).toBeInTheDocument();
    });
});
