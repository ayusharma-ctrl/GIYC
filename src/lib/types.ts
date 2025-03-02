export interface Notification {
    id: string;
    message: string;
    createdAt: Date;
    isRead: boolean;
    icon: string | null;
}

export interface SigninFormData {
    username: string;
    password: string;
}

export interface SigninFormErrors {
    username?: string;
    password?: string;
}

export interface SignupFormData {
    username: string;
    password: string;
    confirmPassword: string;
    avatar: string;
}

export interface SignupFormErrors {
    username?: string;
    password?: string;
    confirmPassword?: string;
    avatar?: string;
}

export interface Destination {
    id: number,
    city: string;
    country: string;
    clues: string[];
    fun_facts: string[];
    trivia: string[];
    imageUrl?: string;
}

export interface GameQuestion {
    destination: Destination;
    options: string[];
    correctAnswer: string;
};

export interface Achievement {
    id: number;
    title: string;
    description: string;
    icon: string;
    createdAt: Date;
}

interface UserAchievement {
    achievementId: number;
    userId: string;
    completedOn: Date;
    createdAt: Date;
}


interface Invite {
    id: number;
    invitedById: string;
    invitee: string;
    isAccepted: boolean;
    createdAt: Date;
}

export interface UserData {
    username: string;
    avatar: string;
    currentStreak: number;
    longestStreak: number;
    totalCorrect: number;
    totalWrong: number;
    totalPlayed: number;
    lastPlayedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    achievements: UserAchievement[];
    Invite: Invite[];
}

export type LimitedUser = {
    id: string;
    username: string,
    totalCorrect: number;
    totalPlayed: number;
    avatar: string;
}