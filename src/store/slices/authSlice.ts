import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface AuthState {
    isAuthenticated: boolean;
    userId: string | null;
}

interface response {
    exist: boolean,
    userId: string | null
}

const appUrl = process.env.NEXT_PUBLIC_FRONTEND_URL!;

async function isCookieExist(): Promise<response> {
    const res = await fetch(`${appUrl}/api/auth/cookie`);
    const data = await res.json();
    if (data?.success && data?.exist && data?.userId) {
        return { exist: true, userId: data?.userId || null };
    }
    return { exist: false, userId: null };
}

const initialState: AuthState = {
    isAuthenticated: (await isCookieExist()).exist || false,
    userId: (await isCookieExist()).userId || null,
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
});

export const { signIn, signOut } = authSlice.actions;
export const authState = (state: RootState) => state.auth;
export default authSlice;