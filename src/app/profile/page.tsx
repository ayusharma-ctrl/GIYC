"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/common/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Trophy, Users, CheckCircle, XCircle, Lock, Unlock, User, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AVATARS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getAchievements, getUserData } from "../actions/user";
import { Achievement, UserData } from "@/lib/types";
import { format } from "date-fns";


export default function ProfilePage() {
    const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null);

    const [userData, setUserData] = useState<UserData>();

    const [allAchievement, setAllAchievement] = useState<Achievement[]>([]);

    const avatar = AVATARS.find(a => a.src === userData?.avatar) || AVATARS[0];

    const { userId } = useSelector((state: RootState) => state.auth);

    const fetchData = async () => {
        if (!userId) return;
        const { error, success, user } = await getUserData(userId);
        if (error && !success) {
            console.log("unable to fetch");
        } else if (user) {
            setUserData(user);
        }
    }

    // fetch list of all achievements
    const fetchAchievements = async () => {
        if (!userId) return;
        const { error, success, achievements } = await getAchievements();
        if (error && !success) {
            console.log("unable to fetch");
        } else if (achievements) {
            setAllAchievement(achievements);
        }
    }

    const isAchievementUnlocked = (id: number) => {
        let isLocked = true;
        userData?.achievements?.forEach((a) => {
            if (a.achievementId === id) {
                isLocked = false;
            }
        });
        return isLocked;
    }

    const unlockedOn = (id: number) => {
        const achievement = userData?.achievements.find((a) => a.achievementId === id);
        if (achievement) {
            return achievement.completedOn;
        }
    }

    useEffect(() => {
        fetchData();
        fetchAchievements();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row gap-6 mb-8 items-center md:items-start">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative"
                        >
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
                                {avatar.src}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
                                <Trophy className="h-4 w-4" />
                            </div>
                        </motion.div>

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold">{userData?.username}</h1>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {avatar.name}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Joined {userData?.createdAt && format(new Date(userData?.createdAt), "MMMM yyyy")}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex-1 flex justify-end">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{userData?.totalPlayed}</div>
                                    <div className="text-sm text-muted-foreground">Games</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{userData?.totalCorrect && userData?.totalPlayed && ((userData?.totalCorrect / userData?.totalPlayed) * 100).toFixed(1)}%</div>
                                    <div className="text-sm text-muted-foreground">Accuracy</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="stats" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="stats" className="cursor-pointer">Statistics</TabsTrigger>
                            <TabsTrigger value="achievements" className="cursor-pointer">Achievements</TabsTrigger>
                            <TabsTrigger value="invites" className="cursor-pointer">Invites</TabsTrigger>
                        </TabsList>

                        <TabsContent value="stats">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5 text-primary" />
                                        Your Performance
                                    </CardTitle>
                                    <CardDescription>
                                        Track your progress and improve your guessing skills
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium">Accuracy</span>
                                                    <span className="text-sm font-medium">{userData?.totalCorrect && userData?.totalPlayed && ((userData?.totalCorrect / userData?.totalPlayed) * 100).toFixed(1)}%</span>
                                                </div>
                                                <Progress value={userData?.totalCorrect && userData?.totalPlayed && ((userData?.totalCorrect / userData?.totalPlayed) * 100)} className="h-2" />
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium">Current Streak</span>
                                                    <span className="text-sm font-medium">{userData?.currentStreak}</span>
                                                </div>
                                                <Progress
                                                    value={userData?.currentStreak && userData?.longestStreak && (userData?.currentStreak / userData?.longestStreak) * 100}
                                                    className="h-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Card className="bg-muted/50">
                                                <CardContent className="p-4 flex flex-col items-center justify-center">
                                                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                                                    <div className="text-2xl font-bold">{userData?.totalCorrect}</div>
                                                    <div className="text-sm text-muted-foreground">Correct</div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-muted/50">
                                                <CardContent className="p-4 flex flex-col items-center justify-center">
                                                    <XCircle className="h-8 w-8 text-red-500 mb-2" />
                                                    <div className="text-2xl font-bold">{userData?.totalWrong}</div>
                                                    <div className="text-sm text-muted-foreground">Incorrect</div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>

                                    <Card className="bg-primary/5 border-primary/20">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Trophy className="h-10 w-10 text-primary" />
                                                <div>
                                                    <h3 className="font-medium">Best Streak: {userData?.longestStreak}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        You&apos;re on a {userData?.currentStreak} game streak now. Keep it up!
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="achievements">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-primary" />
                                        Achievements
                                    </CardTitle>
                                    <CardDescription>
                                        Unlock achievements by playing games and completing challenges
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {allAchievement.map((achievement) => (
                                            <motion.div
                                                key={achievement.id}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedAchievement(
                                                    selectedAchievement === achievement.id ? null : achievement.id
                                                )}
                                                className={cn(
                                                    "relative cursor-pointer rounded-lg border p-4 transition-all",
                                                    !isAchievementUnlocked(achievement.id)
                                                        ? "bg-primary/5 border-primary/20"
                                                        : "bg-muted/50 border-muted grayscale",
                                                    selectedAchievement === achievement.id && "ring-2 ring-primary"
                                                )}
                                            >
                                                <div className="absolute top-2 right-2">
                                                    {!isAchievementUnlocked(achievement.id) ? (
                                                        <Unlock className="h-4 w-4 text-primary" />
                                                    ) : (
                                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </div>

                                                <div className="text-3xl mb-2">{achievement.icon}</div>
                                                <h3 className="font-medium">{achievement.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {achievement.description}
                                                </p>

                                                <AnimatePresence>
                                                    {selectedAchievement === achievement.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="mt-2 pt-2 border-t text-xs text-muted-foreground"
                                                        >
                                                            {!isAchievementUnlocked(achievement.id) ? (
                                                                <span>Unlocked on {format(new Date(unlockedOn(achievement.id)!), "MMMM dd, yyyy")}</span>
                                                            ) : (
                                                                <span>Keep playing to unlock this achievement!</span>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="invites">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        Friend Invites
                                    </CardTitle>
                                    <CardDescription>
                                        Track the status of friends you&apos;ve invited to play
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {userData?.Invite.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((invite) => (
                                            <div
                                                key={invite.id}
                                                className="flex items-center justify-between p-4 rounded-lg border"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback>{invite.invitee.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-medium">{invite.invitee}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Invited on {format(new Date(invite.createdAt!), "MMMM dd, yyyy")}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {invite.isAccepted ? (
                                                        <>
                                                            <Badge className="bg-green-500">Accepted</Badge>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="text-sm text-right">
                                                                <span className="font-medium">Awaiting response</span>
                                                            </div>
                                                            <Badge variant="outline" className="text-amber-500 border-amber-500">
                                                                Pending
                                                            </Badge>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </main>
        </div>
    );
}