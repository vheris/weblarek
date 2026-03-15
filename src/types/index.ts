export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type Payment = 'cash' | 'card' | '';

export interface ProductData {
    id: string,
    title: string,
    image: string,
    category: string,
    price: number | null,
    description: string
}

export interface BuyerData {
    payment: Payment,
    address: string,
    email: string,
    phone: string
}

export interface ProductListResponse {
    total: number;
    items: ProductData[];
}

export interface OrderRequest extends BuyerData {
    items: string[];
    total: number;
}

export interface OrderResponse {
    id: string;
    total: number;
}