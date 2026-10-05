import { Badge, Button, Container, Group, Popover, Text, Title } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';

interface Props {
    countProducts: number;
}

export function Header({ countProducts }: Props) {
    const HeaderProps = {
        bg: 'neutral.0',
        style: {
            position: 'sticky' as const,
            top: 0,
            zIndex: 'var(--mantine-z-index-app)',
        },
    };

    const ContainerProps = {
        c: 'neutral.8',
        h: 60,
        px: 20,
    };

    // Серая плашка: ширина по содержимому, отступ только слева — SHOP прижат к правому краю
    const TitleProps = {
        h: 34,
        fz: 22,
        pl: 'sm',
        bg: 'neutral.2',
        style: {
            borderRadius: '21px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--mantine-spacing-xs)',
        },
    };

    // Зелёная плашка SHOP: ширина по тексту и боковым отступам
    const TitleTextProps = {
        h: 34,
        px: 'sm',
        fz: 22,
        c: 'neutral.0',
        bg: 'brandGreen.6',
        style: {
            borderRadius: '21px',
            display: 'inline-flex',
            alignItems: 'center',
        },
    };

    const PopoverProps = {
        offset: 12,
        position: 'bottom-end' as const,
        shadow: 'xs',
        radius: 16,
    };

    const ButtonProps = {
        h: 44,
        w: 144,
        fz: 16,
    };

    const BadgeProps = {
        c: 'neutral.9',
        bg: 'neutral.0',
    };

    return (
        <header {...HeaderProps}>
            <Container fluid {...ContainerProps}>
                <Group justify="space-between" h="100%">
                    <Title {...TitleProps}>
                        Vegetable{' '}
                        <Text component="span" {...TitleTextProps}>
                            SHOP
                        </Text>
                    </Title>
                    <Popover {...PopoverProps}>
                        <Popover.Target>
                            <Button
                                {...ButtonProps}
                                leftSection={
                                    countProducts > 0 ? (
                                        <Badge {...BadgeProps}>{countProducts}</Badge>
                                    ) : undefined
                                }
                                rightSection={<IconShoppingCart />}
                            >
                                Cart
                            </Button>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Text>Корзина пуста</Text>
                        </Popover.Dropdown>
                    </Popover>
                </Group>
            </Container>
        </header>
    );
}
