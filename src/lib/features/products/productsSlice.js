import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Helper function to get auth headers (optional for products)
const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    } : {}
}

// Async thunks
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/products`, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch products'
            )
        }
    }
)

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/products/${id}`, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch product'
            )
        }
    }
)

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/products`, productData, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to create product'
            )
        }
    }
)

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/products/${id}`, productData, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to update product'
            )
        }
    }
)

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/products/${id}`, getAuthHeaders())
            return id
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to delete product'
            )
        }
    }
)

const initialState = {
    products: [],
    selectedProduct: null,
    isLoading: false,
    error: null,
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.products = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Fetch product by ID
            .addCase(fetchProductById.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.isLoading = false
                state.selectedProduct = action.payload
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Create product
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false
                state.products.push(action.payload)
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false
                const index = state.products.findIndex(product => product.id === action.payload.id)
                if (index !== -1) {
                    state.products[index] = action.payload
                }
                if (state.selectedProduct?.id === action.payload.id) {
                    state.selectedProduct = action.payload
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false
                state.products = state.products.filter(product => product.id !== action.payload)
                if (state.selectedProduct?.id === action.payload) {
                    state.selectedProduct = null
                }
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    },
})

export const { clearError, clearSelectedProduct } = productsSlice.actions
export default productsSlice.reducer
