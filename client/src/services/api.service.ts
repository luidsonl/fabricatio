import { env } from '../env';
import type {
    RawMaterialDTO,
    ProductDTO,
    RawMaterialPackagingDTO,
    ProductionExecutionDTO,
    ProductTransactionDTO,
    RawMaterialPackagingTransactionDTO,
    ProductionSuggestionDTO,
    MaterialRequirementDTO,
    ProductRawMaterialDTO,
} from './api.types';

const fetchBase = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${env.API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        }
    });
    // In test environment, the backend might return 201 Created without body or empty body, 
    // fetch.json() on empty string throws error. So handle text processing.
    if (!response.ok) {
        let errMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
            const errText = await response.text();
            if (errText) {
                try {
                    const errJson = JSON.parse(errText);
                    errMessage = errJson.message || errJson.error || JSON.stringify(errJson);
                } catch {
                    errMessage = errText;
                }
            }
        } catch (e) {
            // Ignore text reading errors
        }
        throw new Error(errMessage);
    }
    const text = await response.text();
    if (!text) return {} as T;
    try {
        return JSON.parse(text) as T;
    } catch (e) {
        return text as unknown as T;
    }
};

export const apiService = {
    // Raw Materials
    getRawMaterials: () => fetchBase<RawMaterialDTO[]>('/raw-materials'),
    getRawMaterialById: (id: number) => fetchBase<RawMaterialDTO>(`/raw-materials/${id}`),
    getRawMaterialByCode: (code: string) => fetchBase<RawMaterialDTO>(`/raw-materials/code/${code}`),
    createRawMaterial: (body: RawMaterialDTO) => fetchBase<RawMaterialDTO>('/raw-materials', { method: 'POST', body: JSON.stringify(body) }),
    updateRawMaterial: (id: number, body: RawMaterialDTO) => fetchBase<RawMaterialDTO>(`/raw-materials/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteRawMaterial: (id: number) => fetchBase<void>(`/raw-materials/${id}`, { method: 'DELETE' }),

    // Products
    getProducts: () => fetchBase<ProductDTO[]>('/products'),
    getProductById: (id: number) => fetchBase<ProductDTO>(`/products/${id}`),
    getProductByCode: (code: string) => fetchBase<ProductDTO>(`/products/code/${code}`),
    createProduct: (body: ProductDTO) => fetchBase<ProductDTO>('/products', { method: 'POST', body: JSON.stringify(body) }),
    updateProduct: (id: number, body: ProductDTO) => fetchBase<ProductDTO>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteProduct: (id: number) => fetchBase<void>(`/products/${id}`, { method: 'DELETE' }),
    addRawMaterialToProduct: (productId: number, rawMaterialId: number, quantity: number) => fetchBase<ProductRawMaterialDTO>(`/products/${productId}/raw-materials?rawMaterialId=${rawMaterialId}&quantity=${quantity}`, { method: 'POST' }),
    removeRawMaterialFromProduct: (associationId: number) => fetchBase<void>(`/products/raw-materials/${associationId}`, { method: 'DELETE' }),

    // Packaging
    getPackagings: () => fetchBase<RawMaterialPackagingDTO[]>('/packaging'),
    getPackagingById: (id: number) => fetchBase<RawMaterialPackagingDTO>(`/packaging/${id}`),
    getPackagingsByRawMaterial: (rawMaterialId: number) => fetchBase<RawMaterialPackagingDTO[]>(`/packaging/raw-material/${rawMaterialId}`),
    createPackaging: (body: RawMaterialPackagingDTO) => fetchBase<RawMaterialPackagingDTO>('/packaging', { method: 'POST', body: JSON.stringify(body) }),
    updatePackaging: (id: number, body: RawMaterialPackagingDTO) => fetchBase<RawMaterialPackagingDTO>(`/packaging/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deletePackaging: (id: number) => fetchBase<void>(`/packaging/${id}`, { method: 'DELETE' }),

    // Transactions
    getProductTransactions: () => fetchBase<ProductTransactionDTO[]>('/product-transactions'),
    getProductTransactionsByProduct: (productId: number) => fetchBase<ProductTransactionDTO[]>(`/product-transactions/product/${productId}`),
    createProductTransaction: (body: ProductTransactionDTO) => fetchBase<ProductTransactionDTO>('/product-transactions', { method: 'POST', body: JSON.stringify(body) }),
    getPackagingTransactions: () => fetchBase<RawMaterialPackagingTransactionDTO[]>('/packaging-transactions'),
    getPackagingTransactionsByPackaging: (packagingId: number) => fetchBase<RawMaterialPackagingTransactionDTO[]>(`/packaging-transactions/packaging/${packagingId}`),
    createPackagingTransaction: (body: RawMaterialPackagingTransactionDTO) => fetchBase<RawMaterialPackagingTransactionDTO>('/packaging-transactions', { method: 'POST', body: JSON.stringify(body) }),

    // Production
    getProductionSuggestions: () => fetchBase<ProductionSuggestionDTO>('/production/suggest'),
    getProductionRequirements: (productId: number, quantity: number) => fetchBase<MaterialRequirementDTO>(`/production/requirements?productId=${productId}&quantity=${quantity}`),
    executeProduction: (body: ProductionExecutionDTO) => fetchBase<void>('/production/execute', { method: 'POST', body: JSON.stringify(body) }),
};
