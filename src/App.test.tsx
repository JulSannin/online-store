import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '@/App';

/**
 * Проверяем только сборку приложения целиком: страница рисуется и шапка на месте.
 * Поведение самой шапки проверяется в modules/Header.test.tsx.
 */
describe('App', () => {
    it('отрисовывает страницу магазина с шапкой', () => {
        render(
            <MantineProvider env="test">
                <App />
            </MantineProvider>,
        );

        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /vegetable shop/i })).toBeInTheDocument();
    });
});
