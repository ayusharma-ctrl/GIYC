"use server";
import prisma from "@/lib/prisma";
import { Destination } from "@/lib/types";

// method to fetch a random destination for game
export async function getRandomDestinationWithOptions() {
    try {
        // Get correct destination
        const result = await prisma.$queryRaw<Array<Destination>>`
                SELECT * FROM "Destination"
                ORDER BY RANDOM()
                LIMIT 1
            `;

        if (!result.length) {
            console.error("No destination found");
            return null;
        }

        const correctDestination = result[0];

        // Get 3 random wrong options
        const wrongCities = await prisma.$queryRaw<Array<{ city: string }>>`
                SELECT city FROM "Destination"
                WHERE city != ${correctDestination.city}
                ORDER BY RANDOM()
                LIMIT 3
            `;

        if (wrongCities.length < 3) {
            console.error("Not enough wrong options found");
            return null;
        }

        // Generate image if missing
        // if (!correctDestination.imageUrl) {
        //     const imagePrompt = await generateImage(
        //         `${correctDestination.city}, ${correctDestination.country}`
        //     );
        //     const imageUrl = await generateImage(imagePrompt);

        //     await prisma.destination.update({
        //         where: { id: correctDestination.id },
        //         data: { imageUrl },
        //     });
        //     correctDestination.imageUrl = imageUrl;
        // }

        // Prepare options
        const options = [
            correctDestination.city,
            ...wrongCities.map(c => c.city)
        ].sort(() => Math.random() - 0.5);

        return {
            destination: {
                id: correctDestination.id,
                city: correctDestination.city,
                country: correctDestination.country,
                clues: correctDestination.clues,
                fun_facts: correctDestination.fun_facts,
                trivia: correctDestination.trivia,
                // imageUrl: correctDestination.imageUrl
            },
            options,
            correctAnswer: correctDestination.city
        };
    } catch (error) {
        console.error("Error fetching random destination:", error);
        return null;
    }
}

// method to handle answer submit
export async function submitAnswer(
    userId: string,
    destinationId: number,
    isCorrect: boolean
) {
    // Update game stats
    await prisma.user.update({
        where: { id: userId },
        data: {
            totalCorrect: { increment: isCorrect ? 1 : 0 },
            totalWrong: { increment: isCorrect ? 0 : 1 },
            totalPlayed: { increment: 1 },
        },
    });

    // Update streaks in background
    updateStreak(userId);

    // Check for achievements asynchronously
    checkAchievements(userId);

    // Record game result
    await prisma.game.create({
        data: {
            userId,
            destinationId,
            isCorrect,
        },
    });
}

// method to update user streak
async function updateStreak(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { lastPlayedAt: true, currentStreak: true, longestStreak: true }
    });

    if (!user) return;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = user.currentStreak;

    if (!user.lastPlayedAt) {
        newStreak = 1;
    } else {
        const lastPlayed = new Date(user.lastPlayedAt);
        const isConsecutive = lastPlayed.toDateString() === yesterday.toDateString();

        newStreak = isConsecutive ? user.currentStreak + 1 : 1;
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            currentStreak: newStreak,
            longestStreak: Math.max(user.longestStreak, newStreak),
            lastPlayedAt: today
        }
    });

    return newStreak;
}

// method to check achievements
async function checkAchievements(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { achievements: true, sentInvites: true }
    });

    if (!user) return;

    // Define achievement conditions
    const achievementsToCheck = [
        { id: 1, condition: () => user.totalPlayed >= 1 }, // First Game
        { id: 2, condition: () => user.totalCorrect >= 1 }, // First Win
        { id: 3, condition: () => user.longestStreak >= 7 }, // 7+ streak
        { id: 4, condition: () => user.longestStreak >= 15 }, // 15+ streak
        { id: 5, condition: () => user.totalCorrect >= 15 }, // 10+ correct answers
        { id: 6, condition: () => user.totalPlayed > 20 && ((user.totalCorrect / user.totalPlayed) >= 0.80) }, // 80% accuracy after 20+ games
        { id: 7, condition: () => user.totalCorrect >= 50 }, // 50+ correct answers
        { id: 8, condition: () => user.sentInvites.length >= 5 }, // 5+ invites sent
    ];

    for (const achievement of achievementsToCheck) {
        const hasAchievement = user.achievements.some(a => a.achievementId === achievement.id);
        // if achievement is new, then update it and add a new entry to users achievements
        if (!hasAchievement && achievement.condition()) {
            await prisma.userAchievement.create({
                data: {
                    userId,
                    achievementId: achievement.id
                }
            });

            await prisma.notification.create({
                data: {
                    userId,
                    message: `New achievement unlocked, Congrats!`,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    isRead: false,
                    icon: '🏆'
                }
            });

        }
    }
}

// method to delete notifications which are expired
export async function deleteExpiredNotifications() {
    await prisma.notification.deleteMany({
        where: {
            expiresAt: {
                lte: new Date(),
            },
        },
    });
}

