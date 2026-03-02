import { describe, it, expect } from 'vitest';
import { apiService } from './api.service';

describe('apiService', () => {
    it('should have all expected raw material fetchers', () => {
        expect(apiService.getRawMaterials).toBeDefined();
        expect(apiService.getRawMaterialById).toBeDefined();
        expect(apiService.getRawMaterialByCode).toBeDefined();
        expect(apiService.createRawMaterial).toBeDefined();
        expect(apiService.updateRawMaterial).toBeDefined();
        expect(apiService.deleteRawMaterial).toBeDefined();
    });

    it('should have all expected product fetchers', () => {
        expect(apiService.getProducts).toBeDefined();
        expect(apiService.getProductById).toBeDefined();
        expect(apiService.getProductByCode).toBeDefined();
        expect(apiService.createProduct).toBeDefined();
        expect(apiService.updateProduct).toBeDefined();
        expect(apiService.deleteProduct).toBeDefined();
        expect(apiService.addRawMaterialToProduct).toBeDefined();
        expect(apiService.removeRawMaterialFromProduct).toBeDefined();
    });

    it('should have all expected packaging fetchers', () => {
        expect(apiService.getPackagings).toBeDefined();
        expect(apiService.getPackagingById).toBeDefined();
        expect(apiService.getPackagingsByRawMaterial).toBeDefined();
        expect(apiService.createPackaging).toBeDefined();
        expect(apiService.updatePackaging).toBeDefined();
        expect(apiService.deletePackaging).toBeDefined();
    });

    it('should have all expected transaction fetchers', () => {
        expect(apiService.getProductTransactions).toBeDefined();
        expect(apiService.getProductTransactionsByProduct).toBeDefined();
        expect(apiService.createProductTransaction).toBeDefined();
        expect(apiService.getPackagingTransactions).toBeDefined();
        expect(apiService.getPackagingTransactionsByPackaging).toBeDefined();
        expect(apiService.createPackagingTransaction).toBeDefined();
    });

    it('should have all expected production fetchers', () => {
        expect(apiService.getProductionSuggestions).toBeDefined();
        expect(apiService.getProductionRequirements).toBeDefined();
        expect(apiService.executeProduction).toBeDefined();
    });
});
