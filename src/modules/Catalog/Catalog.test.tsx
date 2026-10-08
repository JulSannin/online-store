import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test/renderWithProviders';
import { type ApiProduct } from '@/types';

import { Catalog } from './Catalog';

const API_URL = 'https://example.test/products.json';

// Так товары приходят с сервера: у Tomato вес зашит в название, у Capsicum веса нет
const apiProducts: ApiProduct[] = [
    { id: 6, name: 'Tomato - 1 Kg', price: 16, image: 'tomato.jpg', category: 'vegetables' },
    { id: 15, name: 'Capsicum', price: 60, image: 'capsicum.jpg', category: 'vegetables' },
];

// Сервер отвечает списком товаров. Подмену возвращаем, чтобы проверить, с чем её вызвали
function mockProducts() {
    return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(apiProducts),
    } as Response);
}

// Сервер отвечает ошибкой: запрос дошёл, но вместо товаров пришёл код 500
function mockServerError() {
    return vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 500 } as Response);
}

beforeEach(() => {
    // Адрес берётся из .env; подменяем его, чтобы тест не зависел от содержимого файла
    vi.stubEnv('VITE_API_URL', API_URL);
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
});

// У заглушки нет ни роли, ни текста, по которым её можно найти, поэтому она помечена
// data-testid="card-skeleton"
describe('Catalog: загрузка', () => {
    it('пока товары не пришли, вместо карточек показывает заглушки', () => {
        // Запрос не завершается: каталог так и остаётся в загрузке
        vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise<Response>(() => {}));
        renderWithProviders(<Catalog />);

        expect(screen.getByRole('heading', { level: 2, name: 'Catalog' })).toBeInTheDocument();
        expect(screen.getAllByTestId('card-skeleton')).not.toHaveLength(0);
        expect(screen.queryByRole('button', { name: 'Add to cart' })).not.toBeInTheDocument();
    });

    it('запрашивает товары один раз и по адресу из VITE_API_URL', async () => {
        const fetchMock = mockProducts();
        renderWithProviders(<Catalog />);
        await screen.findByText('Tomato');

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(API_URL);
    });
});

describe('Catalog: товары загружены', () => {
    it('заглушки сменяются карточками', async () => {
        mockProducts();
        renderWithProviders(<Catalog />);

        expect(await screen.findByText('Tomato')).toBeInTheDocument();
        expect(screen.getByText('Capsicum')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: 'Add to cart' })).toHaveLength(2);
        expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
    });

    it('показывает цену, а вес — только там, где он есть в названии', async () => {
        mockProducts();
        renderWithProviders(<Catalog />);
        await screen.findByText('Tomato');

        expect(screen.getByText('$ 16')).toBeInTheDocument();
        expect(screen.getByText('$ 60')).toBeInTheDocument();
        // «1 Kg» вынесен из названия в отдельный текст, и он один: у Capsicum веса нет
        expect(screen.getAllByText(/Kg/)).toHaveLength(1);
        expect(screen.getByText('1 Kg')).toBeInTheDocument();
    });
});

describe('Catalog: ошибка загрузки', () => {
    it('если сервер ответил ошибкой, показывает её номер и кнопку Reload', async () => {
        mockServerError();
        renderWithProviders(<Catalog />);

        expect(await screen.findByText('Ошибка 500')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
        // Вместо списка и заглушек остаётся только сообщение
        expect(screen.queryByRole('button', { name: 'Add to cart' })).not.toBeInTheDocument();
        expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
    });

    it('если сети нет совсем, показывает сообщение из ошибки и кнопку Reload', async () => {
        // Без сети fetch не получает ответа, а промис отклоняется: номера ошибки нет
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
        renderWithProviders(<Catalog />);

        expect(await screen.findByText('Failed to fetch')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    });

    it('кнопка Reload перезагружает страницу', async () => {
        const user = userEvent.setup();
        const reload = vi.fn();
        // jsdom не умеет перезагружать страницу, а vi.spyOn(window.location, 'reload')
        // падает с «Cannot redefine property», поэтому подменяем location целиком
        vi.stubGlobal('location', { ...window.location, reload });
        mockServerError();
        renderWithProviders(<Catalog />);

        await user.click(await screen.findByRole('button', { name: 'Reload' }));

        expect(reload).toHaveBeenCalledTimes(1);
    });
});
