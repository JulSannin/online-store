import { MantineProvider } from '@mantine/core';
import { render, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from '@/App';

function renderApp() {
    return render(
        <MantineProvider env="test">
            <App />
        </MantineProvider>,
    );
}

afterEach(() => {
    vi.restoreAllMocks();
});

/**
 * Проверяем только сборку приложения целиком: страница рисуется и шапка на месте.
 * Поведение самой шапки проверяется в modules/Header/Header.test.tsx.
 */
describe('App', () => {
    beforeEach(() => {
        // Запрос товаров не завершается: тест не ходит в сеть, а каталог остаётся в загрузке
        vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise<Response>(() => {}));
    });

    it('отрисовывает страницу магазина с шапкой', () => {
        renderApp();

        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /vegetable shop/i })).toBeInTheDocument();
    });

    it('на странице один h1 — логотип, а заголовок каталога — h2', () => {
        renderApp();

        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(screen.getByRole('heading', { level: 2, name: 'Catalog' })).toBeInTheDocument();
    });
});

const apiProducts = [
    { id: 6, name: 'Tomato - 1 Kg', price: 16, image: 'tomato.jpg', category: 'vegetables' },
    {
        id: 2,
        name: 'Cauliflower - 1 Kg',
        price: 60,
        image: 'cauliflower.jpg',
        category: 'vegetables',
    },
];

// Кладёт в корзину товар из карточки с номером cardIndex в нужном количестве
async function addToCart(user: UserEvent, cardIndex: number, pieces: number) {
    // в карточке уже стоит 1 штука, поэтому плюс нажимаем на один раз меньше
    for (let i = 1; i < pieces; i++) {
        const pluses = screen.getAllByRole('button', { name: 'Увеличить количество' });
        await user.click(pluses[cardIndex]!);
    }

    const addButtons = screen.getAllByRole('button', { name: 'Add to cart' });
    await user.click(addButtons[cardIndex]!);
}

describe('App: корзина целиком', () => {
    beforeEach(() => {
        // Подменяем fetch: товары «приходят» сразу и без настоящей сети
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(apiProducts),
        } as Response);
    });

    it('товар из карточки попадает в корзину, а счётчик в карточке сбрасывается', async () => {
        const user = userEvent.setup();
        renderApp();
        await screen.findByText('Tomato');

        await addToCart(user, 0, 2);

        expect(screen.getByRole('button', { name: 'Cart, 2' })).toBeInTheDocument();
        expect(screen.getAllByRole('textbox', { name: 'Количество' })[0]).toHaveValue('1');

        await addToCart(user, 1, 1);

        expect(screen.getByRole('button', { name: 'Cart, 3' })).toBeInTheDocument();
    });

    it('в корзине + и - пересчитывают итог, а последняя штука убирает строку', async () => {
        const user = userEvent.setup();
        renderApp();
        await screen.findByText('Tomato');
        await addToCart(user, 0, 2); // 2 помидора: 32
        await addToCart(user, 1, 1); // 1 капуста: 60

        await user.click(screen.getByRole('button', { name: 'Cart, 3' }));
        const total = () => screen.getByText('Total').parentElement;
        const row = (index: number) => within(screen.getAllByRole('listitem')[index]!);

        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(total()).toHaveTextContent('$ 92');

        await user.click(row(0).getByRole('button', { name: 'Увеличить количество' }));

        expect(screen.getByRole('button', { name: 'Cart, 4' })).toBeInTheDocument();
        expect(total()).toHaveTextContent('$ 108');

        await user.click(row(1).getByRole('button', { name: 'Уменьшить количество' }));

        expect(screen.getAllByRole('listitem')).toHaveLength(1);
        expect(total()).toHaveTextContent('$ 48');

        for (let i = 0; i < 3; i++) {
            await user.click(row(0).getByRole('button', { name: 'Уменьшить количество' }));
        }

        expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cart' })).toBeInTheDocument();
    });
});
