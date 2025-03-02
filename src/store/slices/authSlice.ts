import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";

interface AuthState {
    isAuthenticated: boolean;
    userId: string | null;
    loading: boolean;
    error: string | null;
}

interface Response {
    exist: boolean;
    userId: string | null;
}

const appUrl = process.env.NEXT_PUBLIC_FRONTEND_URL!;

// Async thunk to check if a cookie exists
export const checkCookie = createAsyncThunk<Response, void>(
    "auth/checkCookie",
    async () => {
        const res = await fetch(`${appUrl}/api/auth/cookie`);
        const data = await res.json();
        if (data?.success && data?.exist && data?.userId) {
            return { exist: true, userId: data?.userId || null };
        }
        return { exist: false, userId: null };
    }
);

const initialState: AuthState = {
    isAuthenticated: false,
    userId: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signIn: (state) => {
            state.isAuthenticated = true;
        },
        signOut: (state) => {
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle pending state
            .addCase(checkCookie.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Handle fulfilled state
            .addCase(checkCookie.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = action.payload.exist;
                state.userId = action.payload.userId;
            })
            // Handle rejected state
            .addCase(checkCookie.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to check cookie";
            });
    },
});

export const { signIn, signOut } = authSlice.actions;
export const authState = (state: RootState) => state.auth;
export default authSlice;