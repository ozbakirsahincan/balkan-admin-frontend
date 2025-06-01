import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                username,
                password,
            })

            // Store token in localStorage
            localStorage.setItem('token', response.data.token)

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || 'Login failed'
            )
        }
    }
)

// Async thunk for logout
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { dispatch }) => {
        localStorage.removeItem('token')
        return true
    }
)

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
        },
        clearCredentials: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user
                state.token = action.payload.token
                state.isAuthenticated = true
                state.error = null
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
                state.isAuthenticated = false
            })
            // Logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                state.token = null
                state.isAuthenticated = false
                state.error = null
            })
    },
})

export const { clearError, setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
