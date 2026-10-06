import { Catalog, Header } from '@/modules/';

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
