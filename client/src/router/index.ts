import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../components/pages/HomePage.vue'
import RawMaterialsPage from '../components/pages/RawMaterialsPage.vue'
import RawMaterialEditPage from '../components/pages/RawMaterialEditPage.vue'
import ProductsPage from '../components/pages/ProductsPage.vue'
import ProductEditPage from '../components/pages/ProductEditPage.vue'
import ProductCreatePage from '../components/pages/ProductCreatePage.vue'
import PackagingPage from '../components/pages/PackagingPage.vue'
import PackagingEditPage from '../components/pages/PackagingEditPage.vue'
import PackagingCreatePage from '../components/pages/PackagingCreatePage.vue'
import ProductTransactionsPage from '../components/pages/ProductTransactionsPage.vue'
import ProductTransactionCreatePage from '../components/pages/ProductTransactionCreatePage.vue'
import ProductTransactionDetailsPage from '../components/pages/ProductTransactionDetailsPage.vue'
import PackagingTransactionsPage from '../components/pages/PackagingTransactionsPage.vue'
import PackagingTransactionCreatePage from '../components/pages/PackagingTransactionCreatePage.vue'
import PackagingTransactionDetailsPage from '../components/pages/PackagingTransactionDetailsPage.vue'
import ProductionPage from '../components/pages/ProductionPage.vue'
import TransactionsPage from '../components/pages/TransactionsPage.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        },
        {
            path: '/raw-materials',
            name: 'rawMaterials',
            component: RawMaterialsPage
        },
        {
            path: '/raw-materials/:id/edit',
            name: 'rawMaterialEdit',
            component: RawMaterialEditPage
        },
        {
            path: '/products',
            name: 'products',
            component: ProductsPage
        },
        {
            path: '/products/create',
            name: 'productCreate',
            component: ProductCreatePage
        },
        {
            path: '/products/:id/edit',
            name: 'productEdit',
            component: ProductEditPage
        },
        {
            path: '/packaging',
            name: 'packaging',
            component: PackagingPage
        },
        {
            path: '/packaging/create',
            name: 'packagingCreate',
            component: PackagingCreatePage
        },
        {
            path: '/packaging/:id/edit',
            name: 'packagingEdit',
            component: PackagingEditPage
        },
        {
            path: '/transactions',
            name: 'transactions',
            component: TransactionsPage
        },
        {
            path: '/transactions/products',
            name: 'productTransactions',
            component: ProductTransactionsPage
        },
        {
            path: '/transactions/products/create',
            name: 'productTransactionCreate',
            component: ProductTransactionCreatePage
        },
        {
            path: '/transactions/products/:id',
            name: 'productTransactionDetails',
            component: ProductTransactionDetailsPage
        },
        {
            path: '/transactions/packaging',
            name: 'packagingTransactions',
            component: PackagingTransactionsPage
        },
        {
            path: '/transactions/packaging/create',
            name: 'packagingTransactionCreate',
            component: PackagingTransactionCreatePage
        },
        {
            path: '/transactions/packaging/:id',
            name: 'packagingTransactionDetails',
            component: PackagingTransactionDetailsPage
        },
        {
            path: '/production',
            name: 'production',
            component: ProductionPage
        }
    ]
})

export default router
