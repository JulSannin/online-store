import { Catalog } from '@/modules/Catalog';
import { Header } from '@/modules/Header';

interface Props {
    countProducts: number;
}

export function MainPage({ countProducts }: Props) {
    return (
        <>
            <Header countProducts={countProducts} />
            <Catalog />
        </>
    );
}
