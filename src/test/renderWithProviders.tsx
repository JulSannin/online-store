import { MantineProvider } from '@mantine/core';
import { render } from '@testing-library/react';
import { type ReactElement } from 'react';

import { type CartItem, CartProvider } from '@/context/cart';
import { theme } from '@/theme';

interface Options {
    // Что лежит в корзине на старте теста
    items?: CartItem[];
}

// Всё, что рендерит компоненты Mantine или читает корзину, нужно оборачивать в провайдеры.
// env="test" отключает анимации и порталы Mantine — иначе popover сложно найти
export function renderWithProviders(ui: ReactElement, { items }: Options = {}) {
    return render(
        <MantineProvider theme={theme} env="test">
            <CartProvider initialItems={items}>{ui}</CartProvider>
        </MantineProvider>,
    );
}
