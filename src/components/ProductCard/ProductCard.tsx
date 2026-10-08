import { Button, Card, Group, Image, Text } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { useState } from 'react';

import { useCart } from '@/context/cart';
import { type Product } from '@/types';
import { QuantityControl } from '@/ui';

import { CardFrameProps } from './cardFrameProps';
import classes from './ProductCard.module.css';

interface Props {
    product: Product;
}

export function ProductCard({ product }: Props) {
    const { dispatch } = useCart();
    const [quantity, setQuantity] = useState(1);
    // Цена не хранится отдельным state, а считается из количества
    const price = product.price * quantity;

    const handleMinus = () => setQuantity((current) => current - 1);
    const handlePlus = () => setQuantity((current) => current + 1);

    const handleAdd = () => {
        dispatch({ type: 'add', product, quantity });
        setQuantity(1); // после добавления счётчик снова дефолтный
    };

    // Размеры общие с заглушкой в каталоге (cardFrameProps.ts):
    // иначе страница дёрнется, когда заглушки сменятся карточками
    const CardProps = {
        className: classes.card,
        ...CardFrameProps,
    };

    const ImageProps = {
        h: 276,
        radius: 8,
        fit: 'contain' as const,
        src: product.image,
        alt: product.name,
    };

    // Верхняя строка: название с весом слева, счётчик справа
    const InfoProps = {
        justify: 'space-between',
        wrap: 'nowrap' as const,
        mt: 'md',
    };

    // Название и вес стоят в одну строку, но стили у них разные
    const NameGroupProps = {
        gap: 'xs',
    };

    const NameProps = {
        fz: 18,
        fw: 600,
        c: 'neutral.8',
    };

    const WeightProps = {
        fz: 14,
        c: 'neutral.5',
    };

    // Цена слева, кнопка занимает всю оставшуюся ширину.
    // mt: auto прижимает строку к низу карточки (Card — это флекс-колонка),
    // поэтому кнопки стоят на одной линии даже при разной длине названий
    const FooterProps = {
        gap: 'sm',
        mt: 'auto',
        wrap: 'nowrap' as const,
    };

    const PriceProps = {
        fz: 20,
        fw: 600,
        c: 'neutral.8',
    };

    // Все цвета и состояния — в CSS-модуле, пропсом c их не задать:
    // инлайновый цвет нельзя перебить на :active
    const AddButtonProps = {
        className: classes.addButton,
        h: 48,
        radius: 12,
        fz: 16,
        flex: 1,
    };

    return (
        <Card {...CardProps}>
            <Image {...ImageProps} />
            <Group {...InfoProps}>
                <Group {...NameGroupProps}>
                    <Text {...NameProps}>{product.name}</Text>
                    {product.weight && <Text {...WeightProps}>{product.weight}</Text>}
                </Group>
                <QuantityControl
                    value={quantity}
                    onMinus={handleMinus}
                    onPlus={handlePlus}
                    minusDisabled={quantity === 1}
                />
            </Group>
            <Group {...FooterProps}>
                <Text {...PriceProps}>$ {price}</Text>
                <Button
                    {...AddButtonProps}
                    onClick={handleAdd}
                    rightSection={<IconShoppingCart size={20} />}
                >
                    Add to cart
                </Button>
            </Group>
        </Card>
    );
}
