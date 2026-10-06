// что приходит с API
export interface ApiProduct {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
}

export interface Product {
    id: number;
    name: string;
    weight?: string;
    price: number;
    image: string;
}

export function toProduct(apiProduct: ApiProduct): Product {
    const [name, weight] = apiProduct.name.split(' - ');

    return {
        id: apiProduct.id,
        name: name ?? apiProduct.name,
        weight,
        price: apiProduct.price,
        image: apiProduct.image,
    };
}
