import { Box, Button, Card, Container, SimpleGrid, Skeleton, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';

import { CARD_WIDTH, CardFrameProps } from '@/components/ProductCard/cardFrameProps';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { type ApiProduct, type Product, toProduct } from '@/types/product';

import classes from './Catalog.module.css';
import loaderSrc from './loader.png';

export function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL)
            .then((res) => {
                if (!res.ok) throw new Error(`Ошибка ${res.status}`);
                return res.json() as Promise<ApiProduct[]>;
            })
            .then((data) => setProducts(data.map(toProduct)))
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки');
            })
            .finally(() => setIsLoading(false));
    }, []);

    const BoxProps = {
        bg: 'neutral.1',
    };

    // Мобильная верстка — всё, что уже sm (768px): отступы вдвое меньше.
    // px: 'md' — это стандартные 16px Container, на мобильном они 8.
    // size 1288 = 4 карточки по 302 + 3 зазора по 16 + 2 отступа по 16:
    // при 1280 четвёртая колонка не помещается и на десктопе было бы три
    const ContainerProps = {
        size: 1288,
        px: { base: 8, sm: 'md' },
    };

    // Заголовок стоит внутри сетки, поэтому между ним и карточками ещё и зазор сетки (8 / 16):
    // pb на него меньше, чем в макете (25 / 50), а расстояние до карточек то же
    const TitleProps = {
        className: classes.title,
        fz: 32,
        pt: { base: 30, sm: 60 },
        pb: { base: 17, sm: 34 },
    };

    // Карточки фиксированной ширины, меняется только число колонок: его считает сама сетка,
    // сколько карточек по CARD_WIDTH помещается (проп cols при minColWidth игнорируется).
    // Блок из колонок выравнивается по центру в CSS-модуле
    const GridProps = {
        className: classes.grid,
        minColWidth: CARD_WIDTH,
        spacing: { base: 8, sm: 'md' },
    };

    const SkeletonProps = {
        height: 276,
        radius: 8,
    };

    // Skeleton прячет своих детей, поэтому иконку кладём поверх него
    const imagePlaceholder = (
        <Box className={classes.imagePlaceholder}>
            <Skeleton {...SkeletonProps} />
            <img src={loaderSrc} alt="" className={classes.loaderIcon} />
        </Box>
    );

    if (isLoading) {
        return (
            <Box component="section" {...BoxProps}>
                <Container {...ContainerProps}>
                    <SimpleGrid {...GridProps}>
                        <Title {...TitleProps}>Catalog</Title>
                        {Array.from({ length: 8 }, (_, index) => (
                            <Card key={index} {...CardFrameProps}>
                                {imagePlaceholder}
                            </Card>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <div>
                <Text>{error}</Text>
                <Button onClick={() => window.location.reload()}>Reload</Button>
            </div>
        );
    }

    return (
        <Box component="section" {...BoxProps}>
            <Container {...ContainerProps}>
                <SimpleGrid {...GridProps}>
                    <Title {...TitleProps}>Catalog</Title>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}
