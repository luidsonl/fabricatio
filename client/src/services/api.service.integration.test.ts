import { describe, it, expect, beforeAll } from 'vitest';
import { apiService } from './api.service';
import { env } from '../env';
import type { RawMaterialDTO, ProductDTO, RawMaterialPackagingDTO, ProductionExecutionDTO } from './api.types';

describe('apiService integration', () => {
    beforeAll(() => {
        if (!env.API_BASE_URL) throw new Error('API_BASE_URL not set');
    });

    it('raw materials CRUD lifecycle works', async () => {
        const newRaw: RawMaterialDTO = {
            code: `vt-${Date.now()}`,
            name: 'Vue Test Raw',
            unit: 'UNIT',
            fractionable: false,
        };

        const created = await apiService.createRawMaterial(newRaw);
        expect(created.id).toBeDefined();
        expect(created.code).toBe(newRaw.code);
        expect(created.name).toBe(newRaw.name);

        const rawList = await apiService.getRawMaterials();
        expect(Array.isArray(rawList)).toBe(true);
        expect(rawList.some((r) => r.id === created.id)).toBe(true);

        const byId = await apiService.getRawMaterialById(created.id!);
        expect(byId.code).toBe(newRaw.code);

        const byCode = await apiService.getRawMaterialByCode(newRaw.code);
        expect(byCode.id).toBe(created.id);

        await apiService.updateRawMaterial(created.id!, { ...created, name: 'Vue Updated' });

        await apiService.deleteRawMaterial(created.id!);
    });

    it('products lifecycle and association with raw material works', async () => {
        const newRaw: RawMaterialDTO = {
            code: `vt-${Date.now()}`,
            name: 'Vue For Product',
            unit: 'UNIT',
            fractionable: false,
        };
        const raw = await apiService.createRawMaterial(newRaw);

        const newProd: ProductDTO = {
            code: `vp-${Date.now()}`,
            name: 'Product Vue Test',
            price: 1.23,
            fractionable: false,
        };
        const prod = await apiService.createProduct(newProd);
        expect(prod.id).toBeDefined();
        expect(prod.code).toBe(newProd.code);

        const prodList = await apiService.getProducts();
        expect(Array.isArray(prodList)).toBe(true);
        expect(prodList.some((p) => p.id === prod.id)).toBe(true);

        const assoc = await apiService.addRawMaterialToProduct(prod.id!, raw.id!, 1);
        expect(assoc.id).toBeDefined();
        expect(typeof assoc.quantityNeeded === 'number' || typeof (assoc as any).quantity === 'number').toBe(true);

        // Use updated endpoint structure from typical backend assuming delete maps to association ID
        await apiService.removeRawMaterialFromProduct(assoc.id!);

        await apiService.updateProduct(prod.id!, { ...prod, name: 'Prod Vue Updated' });
        await apiService.deleteProduct(prod.id!);
        await apiService.deleteRawMaterial(raw.id!);
    });

    it('packaging CRUD and queries work', async () => {
        const newRaw: RawMaterialDTO = {
            code: `vt-${Date.now()}`,
            name: 'Vue For Packaging',
            unit: 'UNIT',
            fractionable: false,
        };
        const raw = await apiService.createRawMaterial(newRaw);

        const newPack: RawMaterialPackagingDTO = {
            name: 'Pack Vue Test',
            rawMaterialId: raw.id!,
            quantityInside: 100,
            currentStock: 10,
        } as any;

        const pack = await apiService.createPackaging(newPack);
        expect(pack.id).toBeDefined();

        const packList = await apiService.getPackagings();
        expect(Array.isArray(packList)).toBe(true);
        expect(packList.some((p) => p.id === pack.id)).toBe(true);

        const byId = await apiService.getPackagingById(pack.id!);
        expect(byId.id).toBe(pack.id);

        const byRaw = await apiService.getPackagingsByRawMaterial(raw.id!);
        expect(Array.isArray(byRaw)).toBe(true);

        await apiService.updatePackaging(pack.id!, { ...pack, name: 'Pack Vue Updated' });
        await apiService.deletePackaging(pack.id!);
        await apiService.deleteRawMaterial(raw.id!);
    });

    it('transactions and production endpoints respond', async () => {
        const newRaw: RawMaterialDTO = {
            code: `vt-${Date.now()}`,
            name: 'Vue For Tx',
            unit: 'UNIT',
            fractionable: false,
        };
        const raw = await apiService.createRawMaterial(newRaw);

        const newPack: RawMaterialPackagingDTO = {
            name: 'Pack For Tx',
            rawMaterialId: raw.id!,
            quantityInside: 50,
            currentStock: 5,
        } as any;
        const pack = await apiService.createPackaging(newPack);

        const newProd: ProductDTO = {
            code: `vp-${Date.now()}`,
            name: 'Prod For Tx Vue',
            price: 2.5,
            fractionable: false,
        };
        const prod = await apiService.createProduct(newProd);

        const prodTx = await apiService.createProductTransaction({ productId: prod.id!, quantity: 1, type: 'INVENTORY_IN' } as any);
        expect(prodTx.id).toBeDefined();

        const prodTxs = await apiService.getProductTransactionsByProduct(prod.id!);
        expect(Array.isArray(prodTxs)).toBe(true);
        expect(prodTxs.some((t) => t.productId === prod.id)).toBe(true);

        const packTx = await apiService.createPackagingTransaction({ packagingId: pack.id!, quantity: 1, type: 'INVENTORY_IN' } as any);
        expect(packTx.id).toBeDefined();

        const packTxs = await apiService.getPackagingTransactionsByPackaging(pack.id!);
        expect(Array.isArray(packTxs)).toBe(true);
        expect(packTxs.some((t) => t.packagingId === pack.id)).toBe(true);

        const suggestions = await apiService.getProductionSuggestions();
        expect(suggestions).toBeDefined();

        const requirements = await apiService.getProductionRequirements(prod.id!, 1);
        expect(requirements).toBeDefined();

        const execBody: ProductionExecutionDTO = {
            producedProducts: [{ productId: prod.id!, quantity: 1 } as any],
            consumedMaterials: [{ packagingId: pack.id!, quantity: 1 } as any],
        } as any;

        const exec = await apiService.executeProduction(execBody);
        expect(exec).toBeDefined();

        await apiService.deleteProduct(prod.id!);
        await apiService.deletePackaging(pack.id!);
        await apiService.deleteRawMaterial(raw.id!);
    });
});
