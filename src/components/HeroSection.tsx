"use client";

import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { motion } from "framer-motion";
import { MapPin, Share2, Play, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export function HeroSection() {
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <div>
            <div className="container relative z-10 mx-auto px-4 h-screen flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-6"
                >
                    <div className="relative">
                        <MapPin className="h-16 w-16 text-primary" />
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.8, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        >
                            <MapPin className="h-16 w-16 text-primary" />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <span className="text-primary">Guess</span> If You Can
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    The Ultimate Travel Guessing Game. Test your knowledge of famous destinations around the world!
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Button
                        size="lg"
                        className="text-lg gap-2 group cursor-pointer"
                        onClick={() => router.push('/game')}
                    >
                        <Play className="h-5 w-5 group-hover:animate-pulse" />
                        Play Now
                    </Button>
                    {
                        isAuthenticated && (
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg gap-2 cursor-pointer"
                                onClick={() => router.push('/invite')}
                            >
                                <Share2 className="h-5 w-5" />
                                Invite Friends
                            </Button>
                        )
                    }
                    {
                        isAuthenticated && (
                            <Button
                                variant="secondary"
                                size="lg"
                                className="text-lg gap-2 cursor-pointer"
                                onClick={() => router.push('/profile')}
                            >
                                <User className="h-5 w-5" />
                                My Profile
                            </Button>
                        )
                    }
                </motion.div>
            </div>
        </div>
    );
}