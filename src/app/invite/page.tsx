"use client";

import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Share2, Copy, Check, Globe } from "lucide-react";
import { toast } from "sonner";
import { sendInvite } from "../actions/invite";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function InvitePage() {
    const [username, setUsername] = useState("");
    const [inviteLink, setInviteLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const { userId } = useSelector((state: RootState) => state.auth);

    const generateInviteLink = async () => {
        if (!username.trim() || username.length < 3 || !userId) {
            toast.error("Please enter a username");
            return;
        }

        setIsGenerating(true);

        const { error } = await sendInvite(userId, username);

        if (error) {
            setIsGenerating(false);
            toast.error(error);
            return;
        }

        // Simulate API call to generate link
        setTimeout(() => {
            const link = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/play/${encodeURIComponent(username)}?invitedBy=${userId}`;
            setInviteLink(link);
            setIsGenerating(false);
            toast.success("Invite link generated successfully!");
        }, 1500);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success("Link copied to clipboard!");

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const shareOnWhatsApp = () => {
        const text = `Hey! I challenge you to beat my score in GIYC - Guess If You Can. Join me: ${inviteLink}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-20 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="h-5 w-5 text-primary" />
                                Challenge Friends
                            </CardTitle>
                            <CardDescription>
                                Generate a unique link to challenge your friends to beat your score!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Your Username</Label>
                                <Input
                                    id="username"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            {inviteLink && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    <div className="p-4 bg-muted rounded-md">
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="relative">
                                                <Globe className="h-16 w-16 text-primary" />
                                                <motion.div
                                                    className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                                >
                                                    !
                                                </motion.div>
                                            </div>
                                        </div>

                                        <p className="text-center font-medium mb-2">Your challenge is ready!</p>

                                        <div className="flex items-center w-full">
                                            <Input
                                                value={inviteLink}
                                                readOnly
                                                className="pr-12 w-full"
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="relative right-12 cursor-pointer"
                                                onClick={copyToClipboard}
                                            >
                                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full cursor-pointer"
                                        onClick={shareOnWhatsApp}
                                    >
                                        Share on WhatsApp
                                    </Button>
                                </motion.div>
                            )}
                        </CardContent>
                        <CardFooter>
                            {!inviteLink ? (
                                <Button
                                    className="w-full cursor-pointer"
                                    onClick={generateInviteLink}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? "Generating..." : "Generate Invite Link"}
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer"
                                    onClick={() => setInviteLink("")}
                                >
                                    Generate New Link
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}