import { createTheme, type MantineColorsTuple } from '@mantine/core';

// 1. Фирменная зеленая палитра: Mantine требует ровно 10 оттенков, от светлого к темному
const brandGreen: MantineColorsTuple = [
    '#eafbee', // 0: Светло-зеленый (для кнопок variant="light")
    '#dbf2e0', // 1
    '#b9e1c2', // 2
    '#94d0a1', // 3
    '#74c186', // 4
    '#60b874', // 5
    '#54b46a', // 6: Главный цвет бренда (Primary) — кнопки, бейджи
    '#449e59', // 7: Эффект наведения (Hover)
    '#398d4d', // 8
    '#2a7a3f', // 9: Самый темный зеленый
];

// 2. Нейтральная серая палитра: тоже 10 оттенков, от белого к черному
// Отдельное имя, а не gray: стандартный gray Mantine использует в своих стилях по номерам
const neutral: MantineColorsTuple = [
    '#FFFFFF', // 0: Чистый белый (внутренний фон карточек, поп-апов)
    '#F3F5FA', // 1: Серый фон страницы каталога
    '#E9ECEF', // 2: Фон кнопок степпера, границы
    '#DEE2E6', // 3: Разделительные линии
    '#CED4DA', // 4: Границы полей ввода
    '#868E96', // 5: Второстепенный текст (вес товара "1 kg")
    '#495057', // 6
    '#343A40', // 7
    '#212529', // 8: Основной темный текст (названия товаров, цены)
    '#000000', // 9: Чистый черный
];

export const theme = createTheme({
    primaryColor: 'brandGreen',
    primaryShade: 6, // #54b46a по умолчанию для Filled кнопок

    colors: {
        brandGreen,
        neutral, // c="neutral.5", bg="neutral.1", в CSS var(--mantine-color-neutral-1)
    },

    // Типографика: в макете только Inter — Regular 400, SemiBold 600 и изредка Medium 500 (fw={500})
    fontFamily: 'Inter, sans-serif',
    fontWeights: {
        regular: '400',
        medium: '600', // SemiBold — основное начертание макета, его берут кнопки и поля Mantine
        bold: '600', // 700 в макете нет и не загружается
    },
    headings: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
    },
});
