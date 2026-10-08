import { Badge, Box, Button, Container, Group, Popover, Text, Title } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';

import { CartPopover } from '@/components';
import { useCart } from '@/context/cart';

import classes from './Header.module.css';

export function Header() {
    const { items } = useCart();
    // Общее количество штук: 3 помидора и 1 капуста — это 4, а не 2
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const isEmpty = count === 0;

    // z-index пропсом не задать, поэтому он один остался в CSS-модуле
    const HeaderProps = {
        className: classes.header,
        pos: 'sticky' as const,
        top: 0,
        bg: 'neutral.0',
    };

    // Мобильная верстка — экраны меньше 768px (ниже sm): отступы вдвое меньше
    const ContainerProps = {
        h: 60,
        px: { base: 10, sm: 20 },
    };

    // nowrap: иначе кнопка при нехватке места переносится на вторую строку
    // и повисает под белой полосой шапки
    const GroupProps = {
        justify: 'space-between',
        wrap: 'nowrap' as const,
        h: '100%',
    };

    // Серая плашка: ширина по содержимому, отступ только слева —
    // поэтому зелёная плашка SHOP прижата к правому краю
    const TitleProps = {
        h: 34,
        fz: 22,
        pl: 'sm',
        c: 'neutral.8',
        bg: 'neutral.2',
        bdrs: 21,
        display: 'inline-flex',
    };

    // Внутренний Group даёт выравнивание по центру и зазор между словами:
    // пропсов align-items и gap у Mantine нет
    const LogoGroupProps = {
        component: 'span' as const,
        gap: 'xs',
        h: '100%',
    };

    // Зелёная плашка SHOP: ширина по тексту и боковым отступам
    const LogoAccentProps = {
        component: 'span' as const,
        h: 34,
        fz: 22,
        px: 'sm',
        c: 'neutral.0',
        bg: 'brandGreen.6',
        bdrs: 21,
        display: 'inline-flex',
    };

    // Пустая корзина по макету — карточка поуже: 300 вместо 380
    const PopoverProps = {
        offset: 12,
        position: 'bottom-end' as const,
        shadow: 'xs',
        radius: 16,
        width: isEmpty ? 300 : 380,
    };

    // Внутренние отступы popover; maw не даёт ему вылезти за экран на телефоне.
    // У пустой корзины по макету нет рамки, а отступы сверху и снизу меньше: 24 вместо 28
    const DropdownProps = {
        px: 24,
        py: isEmpty ? 24 : 28,
        bd: isEmpty ? 0 : undefined,
        maw: 'calc(100vw - 20px)',
    };

    // На мобильном ширина по содержимому: без слова «Cart» остаются иконка и цифра.
    // aria-label нужен, чтобы у кнопки осталось имя, когда текст скрыт
    const ButtonProps = {
        h: 44,
        w: { base: 'auto', sm: 174 },
        fz: 16,
        'aria-label': count > 0 ? `Cart, ${count}` : 'Cart',
    };

    // Иконка стоит в содержимом, а не в rightSection: у секции есть свой отступ слева,
    // и без слова «Cart» иконка сместилась бы от центра кнопки
    const ButtonContentProps = {
        component: 'span' as const,
        gap: 'xs',
        wrap: 'nowrap' as const,
    };

    const CartLabelProps = {
        component: 'span' as const,
        visibleFrom: 'sm' as const,
    };

    const BadgeProps = {
        c: 'neutral.9',
        bg: 'neutral.0',
    };

    return (
        <Box component="header" {...HeaderProps}>
            <Container fluid {...ContainerProps}>
                <Group {...GroupProps}>
                    <Title {...TitleProps}>
                        <Group {...LogoGroupProps}>
                            Vegetable
                            <Text {...LogoAccentProps}>SHOP</Text>
                        </Group>
                    </Title>
                    <Popover {...PopoverProps}>
                        <Popover.Target>
                            <Button
                                {...ButtonProps}
                                leftSection={
                                    count > 0 ? <Badge {...BadgeProps}>{count}</Badge> : undefined
                                }
                            >
                                <Group {...ButtonContentProps}>
                                    <Box {...CartLabelProps}>Cart</Box>
                                    <IconShoppingCart />
                                </Group>
                            </Button>
                        </Popover.Target>
                        <Popover.Dropdown {...DropdownProps}>
                            <CartPopover />
                        </Popover.Dropdown>
                    </Popover>
                </Group>
            </Container>
        </Box>
    );
}
