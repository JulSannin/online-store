import { CartProvider } from '@/context/cart';
import { MainPage } from '@/pages';

export default function App() {
    return (
        <CartProvider>
            <MainPage />
        </CartProvider>
    );
}
