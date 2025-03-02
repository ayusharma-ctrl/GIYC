-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_invitee_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "icon" TEXT DEFAULT '🏆',
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_SentInvites" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SentInvites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SentInvites_B_index" ON "_SentInvites"("B");

-- AddForeignKey
ALTER TABLE "_SentInvites" ADD CONSTRAINT "_SentInvites_A_fkey" FOREIGN KEY ("A") REFERENCES "Invite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SentInvites" ADD CONSTRAINT "_SentInvites_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
