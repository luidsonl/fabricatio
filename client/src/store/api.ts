import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/api.service';
import type {
    RawMaterialDTO,
    ProductDTO,
    RawMaterialPackagingDTO,
    ProductionExecutionDTO,
    ProductTransactionDTO,
    RawMaterialPackagingTransactionDTO,
    ProductionSuggestionDTO,
} from '../services/api.types';

export const useApiStore = defineStore('api', () => {
    const rawMaterials = ref<RawMaterialDTO[]>([]);
    const products = ref<ProductDTO[]>([]);
    const packagings = ref<RawMaterialPackagingDTO[]>([]);
    const productTransactions = ref<ProductTransactionDTO[]>([]);
    const packagingTransactions = ref<RawMaterialPackagingTransactionDTO[]>([]);
    const productionSuggestions = ref<ProductionSuggestionDTO | null>(null);

    // Raw Materials
    const getRawMaterials = async () => {
        rawMaterials.value = await apiService.getRawMaterials();
        return rawMaterials.value;
    };
    const getRawMaterialById = (id: number) => apiService.getRawMaterialById(id);
    const getRawMaterialByCode = (code: string) => apiService.getRawMaterialByCode(code);
    const createRawMaterial = async (body: RawMaterialDTO) => {
        const res = await apiService.createRawMaterial(body);
        await getRawMaterials();
        return res;
    };
    const updateRawMaterial = async (id: number, body: RawMaterialDTO) => {
        const res = await apiService.updateRawMaterial(id, body);
        await getRawMaterials();
        return res;
    };
    const deleteRawMaterial = async (id: number) => {
        await apiService.deleteRawMaterial(id);
        await getRawMaterials();
    };

    // Products
    const getProducts = async () => {
        products.value = await apiService.getProducts();
        return products.value;
    };
    const getProductById = (id: number) => apiService.getProductById(id);
    const getProductByCode = (code: string) => apiService.getProductByCode(code);
    const createProduct = async (body: ProductDTO) => {
        const res = await apiService.createProduct(body);
        await getProducts();
        return res;
    };
    const updateProduct = async (id: number, body: ProductDTO) => {
        const res = await apiService.updateProduct(id, body);
        await getProducts();
        return res;
    };
    const deleteProduct = async (id: number) => {
        await apiService.deleteProduct(id);
        await getProducts();
    };
    const addRawMaterialToProduct = async (productId: number, rawMaterialId: number, quantity: number) => {
        const res = await apiService.addRawMaterialToProduct(productId, rawMaterialId, quantity);
        await getProducts();
        return res;
    };
    const removeRawMaterialFromProduct = async (associationId: number) => {
        await apiService.removeRawMaterialFromProduct(associationId);
        await getProducts();
    };

    // Packaging
    const getPackagings = async () => {
        packagings.value = await apiService.getPackagings();
        return packagings.value;
    };
    const getPackagingById = (id: number) => apiService.getPackagingById(id);
    const getPackagingsByRawMaterial = (rawMaterialId: number) => apiService.getPackagingsByRawMaterial(rawMaterialId);
    const createPackaging = async (body: RawMaterialPackagingDTO) => {
        const res = await apiService.createPackaging(body);
        await getPackagings();
        return res;
    };
    const updatePackaging = async (id: number, body: RawMaterialPackagingDTO) => {
        const res = await apiService.updatePackaging(id, body);
        await getPackagings();
        return res;
    };
    const deletePackaging = async (id: number) => {
        await apiService.deletePackaging(id);
        await getPackagings();
    };

    // Transactions
    const getProductTransactions = async () => {
        productTransactions.value = await apiService.getProductTransactions();
        return productTransactions.value;
    };
    const getProductTransactionsByProduct = (productId: number) => apiService.getProductTransactionsByProduct(productId);
    const createProductTransaction = async (body: ProductTransactionDTO) => {
        const res = await apiService.createProductTransaction(body);
        await Promise.all([getProductTransactions(), getProducts()]);
        return res;
    };

    const getPackagingTransactions = async () => {
        packagingTransactions.value = await apiService.getPackagingTransactions();
        return packagingTransactions.value;
    };
    const getPackagingTransactionsByPackaging = (packagingId: number) => apiService.getPackagingTransactionsByPackaging(packagingId);
    const createPackagingTransaction = async (body: RawMaterialPackagingTransactionDTO) => {
        const res = await apiService.createPackagingTransaction(body);
        await Promise.all([getPackagingTransactions(), getPackagings()]);
        return res;
    };

    // Production
    const getProductionSuggestions = async () => {
        productionSuggestions.value = await apiService.getProductionSuggestions();
        return productionSuggestions.value;
    };
    const getProductionRequirements = (productId: number, quantity: number) => apiService.getProductionRequirements(productId, quantity);
    const executeProduction = async (body: ProductionExecutionDTO) => {
        await apiService.executeProduction(body);
        await Promise.all([getProducts(), getPackagings(), getProductTransactions(), getPackagingTransactions()]);
    };

    return {
        rawMaterials,
        products,
        packagings,
        productTransactions,
        packagingTransactions,
        productionSuggestions,
        getRawMaterials,
        getRawMaterialById,
        getRawMaterialByCode,
        createRawMaterial,
        updateRawMaterial,
        deleteRawMaterial,
        getProducts,
        getProductById,
        getProductByCode,
        createProduct,
        updateProduct,
        deleteProduct,
        addRawMaterialToProduct,
        removeRawMaterialFromProduct,
        getPackagings,
        getPackagingById,
        getPackagingsByRawMaterial,
        createPackaging,
        updatePackaging,
        deletePackaging,
        getProductTransactions,
        getProductTransactionsByProduct,
        createProductTransaction,
        getPackagingTransactions,
        getPackagingTransactionsByPackaging,
        createPackagingTransaction,
        getProductionSuggestions,
        getProductionRequirements,
        executeProduction
    };
});
