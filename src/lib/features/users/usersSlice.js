import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}

// Async thunks
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users`, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch users'
            )
        }
    }
)

export const fetchUserById = createAsyncThunk(
    'users/fetchUserById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/${id}`, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch user'
            )
        }
    }
)

export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users`, userData, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to create user'
            )
        }
    }
)

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/users/${id}`, userData, getAuthHeaders())
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to update user'
            )
        }
    }
)

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/users/${id}`, getAuthHeaders())
            return id
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to delete user'
            )
        }
    }
)

const initialState = {
    users: [],
    selectedUser: null,
    isLoading: false,
    error: null,
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch users
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Fetch user by ID
            .addCase(fetchUserById.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.isLoading = false
                state.selectedUser = action.payload
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Create user
            .addCase(createUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.users.push(action.payload)
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Update user
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false
                const index = state.users.findIndex(user => user.id === action.payload.id)
                if (index !== -1) {
                    state.users[index] = action.payload
                }
                if (state.selectedUser?.id === action.payload.id) {
                    state.selectedUser = action.payload
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.users = state.users.filter(user => user.id !== action.payload)
                if (state.selectedUser?.id === action.payload) {
                    state.selectedUser = null
                }
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    },
})

export const { clearError, clearSelectedUser } = usersSlice.actions
export default usersSlice.reducer
