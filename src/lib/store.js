import { configureStore } from '@reduxjs/toolkit'
import authSlice from './features/auth/authSlice'
import usersSlice from './features/users/usersSlice'
import categoriesSlice from './features/categories/categoriesSlice'
import productsSlice from './features/products/productsSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        users: usersSlice,
        categories: categoriesSlice,
        products: productsSlice,
    },
})
