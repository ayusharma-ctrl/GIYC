"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SigninFormData, SignupFormData } from "@/lib/types";

export async function register(formData: SignupFormData) {
    const { username, password, confirmPassword, avatar } = formData;

    // validate request body data
    if (!username || !password || !confirmPassword || !avatar || password !== confirmPassword) {
        return { success: false, error: "Invalid credentials" }
    }

    try {
        // check for unique username
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) return { success: false, error: "Username already exists" };

        const hashedPassword = await bcrypt.hash(password, 10); // hashed password before saving

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                avatar
            }
        });

        (await cookies()).set("session", user.id.toString(), {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return { success: true, error: null }
    } catch (error) {
        console.log(error);
        return { success: false, error: "Something went wrong" }
    }

}

export async function login(formData: SigninFormData) {
    const { username, password } = formData;

    // validate credentials
    if (!username || !password) {
        return { success: false, error: "Invalid credentials" }
    }

    try {
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return { success: false, error: "Invalid credentials" };
        }

        (await cookies()).set("session", user.id.toString(), {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return { success: true, error: null }
    } catch (error) {
        console.log(error);
        return { success: false, error: "Something went wrong" }
    }

}

export async function validateUsername(username: string): Promise<boolean> {

    if (!username || username.length < 3) {
        return false;
    }

    const user = await prisma.user.findFirst({ where: { username } });
    if (user) {
        return false;
    }

    return true;
}

export async function logout() {
    (await cookies()).delete("session");
    redirect("/auth"); // Note: cann't call redirect() within a try/catch block
}