"use server"
import prisma from "@/lib/prisma";


// read user data
export const getUserData = async (userId: string) => {
    if (!userId) return { success: false, error: "User ID is missing" }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                achievements: true,
                Invite: true,
            }
        })

        if (!user) return { success: false, error: "Couldn't find user in db" }

        return { success: true, error: null, user }
    } catch (error) {
        console.log(error);
        return { success: false, error: "Something went wrong" }
    }
}


// get achievemnets
export const getAchievements = async () => {
    try {
        const achievements = await prisma.achievement.findMany();

        if (!achievements) return { success: false, error: "Couldn't find achievements" }

        return { success: true, error: null, achievements }
    } catch (error) {
        console.log(error);
        return { success: false, error: "Something went wrong" }
    }
}

// get limited data
export const getLimitedUserData = async (userId: string) => {
    if (!userId) return { success: false, error: "User ID is missing" }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                avatar: true,
                username: true,
                totalPlayed: true,
                totalCorrect: true,
            }
        })

        if (!user) return { success: false, error: "Couldn't find user in db" }

        return { success: true, error: null, user }
    } catch (error) {
        console.log(error);
        return { success: false, error: "Something went wrong" }
    }
}