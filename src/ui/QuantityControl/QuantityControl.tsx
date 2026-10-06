import { ActionIcon, Box, Group } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';

interface Props {
    value: number;
    onMinus: () => void;
    onPlus: () => void;
    minusDisabled?: boolean;
}

// «Глупый» компонент: ничего не хранит и про корзину не знает, всё приходит пропсами.
// Один и тот же счётчик стоит в карточке товара и в строках корзины
export function QuantityControl({ value, onMinus, onPlus, minusDisabled }: Props) {
    const GroupProps = {
        gap: 0,
        wrap: 'nowrap' as const,
    };

    // color задаёт фон и наведение (следующий оттенок палитры),
    // c — цвет иконки: белый Mantine ставит сам, пропс c его перебивает
    const ButtonProps = {
        color: 'neutral.2',
        c: 'neutral.8',
        size: 28,
        radius: 8,
    };

    // Инпут только показывает число, вписать его руками нельзя.
    // tabIndex -1: поле не интерактивное, незачем ловить на нём фокус
    const ValueProps = {
        component: 'input' as const,
        readOnly: true,
        tabIndex: -1,
        w: 32,
        h: 28,
        ta: 'center' as const,
        fz: 16,
        c: 'neutral.8',
        'aria-label': 'Количество',
    };

    return (
        <Group {...GroupProps}>
            <ActionIcon
                {...ButtonProps}
                onClick={onMinus}
                disabled={minusDisabled}
                aria-label="Уменьшить количество"
            >
                <IconMinus size={16} />
            </ActionIcon>
            <Box {...ValueProps} value={value} />
            <ActionIcon {...ButtonProps} onClick={onPlus} aria-label="Увеличить количество">
                <IconPlus size={16} />
            </ActionIcon>
        </Group>
    );
}
