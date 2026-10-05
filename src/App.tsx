import { useState } from 'react';

import { MainPage } from '@/pages/MainPage';

export default function App() {
    // Временно: по плану счётчик переедет в CartProvider (useReducer)
    const [countProducts] = useState(0);

    return <MainPage countProducts={countProducts} />;
}
