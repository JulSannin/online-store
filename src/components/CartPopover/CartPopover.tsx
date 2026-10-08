import { Box, Divider, Group, Image, Stack, Text } from '@mantine/core';

import { useCart } from '@/context/cart';
import { QuantityControl } from '@/ui';

import emptyCartSrc from './cart_empty.png';

export function CartPopover() {
    const { items, dispatch } = useCart();

    // Итог и цену строки не храним, а считаем по списку
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Строка корзины: картинка, название с ценой и счётчик справа
    const RowProps = {
        gap: 'sm',
        wrap: 'nowrap' as const,
        py: 'sm',
    };

    // alt пустой: рядом с картинкой стоит название, повторять его скринридеру незачем
    const ImageProps = {
        w: 48,
        h: 48,
        fit: 'contain' as const,
        radius: 'sm',
        alt: '',
    };

    const InfoProps = {
        flex: 1,
    };

    const NameGroupProps = {
        gap: 'xs',
    };

    const NameProps = {
        fz: 16,
        fw: 600,
        c: 'neutral.8',
    };

    const WeightProps = {
        fz: 14,
        c: 'neutral.5',
    };

    const PriceProps = {
        fz: 16,
        fw: 600,
        c: 'neutral.8',
    };

    const DividerProps = {
        color: 'neutral.2',
    };

    const TotalProps = {
        justify: 'space-between',
        pt: 'md',
    };

    const TotalTextProps = {
        fz: 18,
        fw: 600,
        c: 'neutral.8',
    };

    // Пустая корзина: иллюстрация и подпись по центру. Отступы сверху и по бокам даёт
    // dropdown у Popover, поэтому здесь только зазор между элементами и добавка снизу:
    // в макете под подписью места больше, чем над иллюстрацией
    const EmptyProps = {
        align: 'center',
        gap: 25,
        pb: 25,
    };

    // alt пустой: иллюстрация декоративная, то же самое сказано в подписи под ней
    const EmptyImageProps = {
        src: emptyCartSrc,
        w: 118,
        h: 108,
        fit: 'contain' as const,
        alt: '',
    };

    // Текст как в макете, вместе с «You» вместо «Your». lh 1.2, а не 1.55 от Mantine:
    // в макете подпись стоит ближе к иллюстрации, строка у неё ниже
    const EmptyTextProps = {
        fz: 16,
        c: 'neutral.5',
        lh: 1.2,
    };

    if (items.length === 0) {
        return (
            <Stack {...EmptyProps}>
                <Image {...EmptyImageProps} />
                <Text {...EmptyTextProps}>You cart is empty!</Text>
            </Stack>
        );
    }

    return (
        <>
            <Box component="ul">
                {items.map(({ product, quantity }) => (
                    <Box component="li" key={product.id}>
                        <Group {...RowProps}>
                            <Image {...ImageProps} src={product.image} />
                            <Box {...InfoProps}>
                                <Group {...NameGroupProps}>
                                    <Text {...NameProps}>{product.name}</Text>
                                    {product.weight && (
                                        <Text {...WeightProps}>{product.weight}</Text>
                                    )}
                                </Group>
                                <Text {...PriceProps}>$ {product.price * quantity}</Text>
                            </Box>
                            <QuantityControl
                                value={quantity}
                                onMinus={() => dispatch({ type: 'decrease', id: product.id })}
                                onPlus={() => dispatch({ type: 'increase', id: product.id })}
                            />
                        </Group>
                        <Divider {...DividerProps} />
                    </Box>
                ))}
            </Box>
            <Group {...TotalProps}>
                <Text {...TotalTextProps}>Total</Text>
                <Text {...TotalTextProps}>$ {total}</Text>
            </Group>
        </>
    );
}
