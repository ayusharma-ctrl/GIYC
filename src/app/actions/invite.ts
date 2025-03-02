"use server";
import prisma from "@/lib/prisma";

// method to send invite
export const sendInvite = async (invitedById: string, invitee: string) => {
    if (!invitedById || !invitee) return { success: false, error: 'Insuffient info' }

    try {
        // check for unique username
        const existingUser = await prisma.user.findUnique({ where: { username: invitee } });
        if (existingUser) return { success: false, error: "Username already exists" };

        // existing invite by this user
        const existingInvite = await prisma.invite.findFirst({ where: { invitedById, invitee } });
        if (existingInvite) return { success: false, error: "You've already sent an invite to this user" };

        await prisma.invite.create({
            data: {
                invitedById,
                invitee,
            }
        });

        return { success: true, error: null }
    } catch (error) {
        console.log(error);
        return { success: false, error: 'Something went wrong' }
    }
}


// method to accept invite - basically signup
export const acceptInvite = async (invitedById: string, invitee: string) => {

    const existingInvite = await prisma.invite.findFirst({ where: { invitedById, invitee } });

    if (!existingInvite) return;

    await prisma.invite.update({
        where: { id: existingInvite?.id },
        data: {
            isAccepted: true,
            updatedAt: new Date()
        },
    });

    await prisma.notification.create({
        data: {
            userId: invitedById,
            message: `@${invitee} has accepted you invitation!`,
            icon: '🤩',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            isRead: false
        }
    });

}