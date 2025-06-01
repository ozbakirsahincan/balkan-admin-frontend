import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Helper function to get auth headers (optional for categories)
const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    } : {}
}

// Async thunks
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/categories`, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch categories'
            )
        }
    }
)

export const fetchCategoryById = createAsyncThunk(
    'categories/fetchCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/categories/${id}`, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch category'
            )
        }
    }
)

export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/categories`, categoryData, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to create category'
            )
        }
    }
)

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ id, categoryData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/categories/${id}`, categoryData, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to update category'
            )
        }
    }
)

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/categories/${id}`, getAuthHeaders())
            return id
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to delete category'
            )
        }
    }
)

const initialState = {
    categories: [],
    selectedCategory: null,
    isLoading: false,
    error: null,
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearSelectedCategory: (state) => {
            state.selectedCategory = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch categories
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false
                state.categories = action.payload
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Fetch category by ID
            .addCase(fetchCategoryById.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.isLoading = false
                state.selectedCategory = action.payload
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Create category
            .addCase(createCategory.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isLoading = false
                state.categories.push(action.payload)
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Update category
            .addCase(updateCategory.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isLoading = false
                const index = state.categories.findIndex(category => category.id === action.payload.id)
                if (index !== -1) {
                    state.categories[index] = action.payload
                }
                if (state.selectedCategory?.id === action.payload.id) {
                    state.selectedCategory = action.payload
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Delete category
            .addCase(deleteCategory.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.isLoading = false
                state.categories = state.categories.filter(category => category.id !== action.payload)
                if (state.selectedCategory?.id === action.payload) {
                    state.selectedCategory = null
                }
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    },
})

export const { clearError, clearSelectedCategory } = categoriesSlice.actions
export default categoriesSlice.reducer
