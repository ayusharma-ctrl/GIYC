"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/common/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { MapPin, HelpCircle, Award, RefreshCw, MoveLeftIcon, Timer } from "lucide-react";
import { GameQuestion } from "@/lib/types";
import { getRandomDestinationWithOptions, submitAnswer } from "../actions/game";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";


export default function GamePage() {
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });
    const [showFunFact, setShowFunFact] = useState(false);
    const [funFactIndex, setFunFactIndex] = useState(0);
    const [clueIndex, setClueIndex] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);

    const [question, setQuestion] = useState<GameQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isTimerActive, setIsTimerActive] = useState(true);

    const { userId } = useSelector((state: RootState) => state.auth)

    const loadNewQuestion = async () => {
        const newQuestion = await getRandomDestinationWithOptions();
        setQuestion(newQuestion);
        setSelectedAnswer(null);
        setTimeLeft(30);
        setIsTimerActive(true);
    };

    const router = useRouter();

    useEffect(() => {
        loadNewQuestion();
    }, []);

    useEffect(() => {
        if (!isTimerActive) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isTimerActive]);

    const handleTimeUp = () => {
        setIsTimerActive(false);
        setSelectedAnswer("TIME_UP");
    };

    useEffect(() => {
        if (selectedAnswer === "TIME_UP") {
            setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
            submitAnswer(userId!, question?.destination?.id || 0, false);
            setShowFunFact(true);
            setShowNextButton(true);
        }
    }, [selectedAnswer])

    const handleAnswer = (answer: string) => {
        setIsTimerActive(false);
        setSelectedAnswer(answer);

        if (answer === question?.correctAnswer) {
            setIsCorrect(true);
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }

        submitAnswer(userId!, question?.destination?.id || 0, answer === question?.correctAnswer);

        setShowFunFact(true);
        setShowNextButton(true);
    };

    const handleNextFunFact = () => {
        if (question && funFactIndex < question?.destination?.fun_facts?.length - 1) {
            setFunFactIndex(prev => prev + 1);
        } else {
            setFunFactIndex(0);
        }
    };

    const handleNextClue = () => {
        if (question && clueIndex < question.destination.clues.length - 1) {
            setClueIndex(prev => prev + 1);
        }
    };

    const handleNextDestination = async () => {
        await loadNewQuestion();
        // const nextIndex = (currentDestinationIndex + 1) % mockDestinations.length;
        // setCurrentDestinationIndex(nextIndex);
        setIsCorrect(null);
        setShowFunFact(false);
        setFunFactIndex(0);
        setClueIndex(0);
        setShowNextButton(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center">
                <div className="w-full max-w-3xl">
                    <motion.div
                        className="flex justify-between items-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2">
                            <MapPin className="h-6 w-6 text-primary" />
                            <h1 className="text-2xl font-bold">GIYC Challenge</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Award className="h-5 w-5 text-green-500" />
                                <span>{score.correct}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Award className="h-5 w-5 text-red-500" />
                                <span>{score.incorrect}</span>
                            </div>
                        </div>
                    </motion.div>

                    {!question ? <span>Loading...</span> : (
                        <AnimatePresence mode="wait">
                            {!showFunFact ? (
                                <motion.div
                                    key="question"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="flex justify-end items-center p-4 bg-card">
                                        <div className="flex items-center gap-2">
                                            <Timer className="h-6 w-6" />
                                            <span className="text-xl font-bold">{timeLeft}s</span>
                                        </div>
                                    </div>

                                    <Card className="mb-6">
                                        <CardContent className="pt-6">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-primary/10 p-3 rounded-full">
                                                    <HelpCircle className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold mb-2">Guess the Destination</h2>
                                                    <p className="text-lg mb-4">{question.destination.clues[clueIndex]}</p>

                                                    {clueIndex < question.destination.clues.length - 1 && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleNextClue}
                                                            className="mb-2"
                                                        >
                                                            Need another clue?
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <motion.div
                                        animate={timeLeft === 0 ? {
                                            x: [0, -10, 10, -10, 0],
                                            transition: { duration: 0.5 }
                                        } : {}}
                                    >
                                        <h2 className="text-lg mb-2">
                                            Choose your answer.
                                        </h2>
                                    </motion.div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {question.options.map((option, index) => (
                                            <motion.div
                                                key={option}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: { delay: index * 0.1 }
                                                }}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full h-16 text-lg justify-start px-4"
                                                    onClick={() => handleAnswer(option)}
                                                >
                                                    {option}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Card className="overflow-hidden">
                                        <div
                                            className={`p-4 text-center ${isCorrect ? "bg-green-500" : "bg-red-500"
                                                } text-white`}
                                        >
                                            <h2 className="text-xl font-bold">
                                                {isCorrect ? "Correct! 🎉" : "Not quite right! 😢"}
                                            </h2>
                                            <p>
                                                {isCorrect
                                                    ? "Amazing job! You guessed it right."
                                                    : `The correct answer was ${question.correctAnswer}.`}
                                            </p>
                                        </div>

                                        <CardContent className="pt-6">
                                            <div className="mb-4">
                                                <h3 className="text-lg font-semibold mb-2">
                                                    {question.destination.city}, {question.destination.country}
                                                </h3>
                                                <motion.div
                                                    key={funFactIndex}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="bg-muted p-4 rounded-md"
                                                >
                                                    <p className="font-medium">Fun Fact:</p>
                                                    <p>{question.destination.fun_facts[funFactIndex]}</p>
                                                </motion.div>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                <Button
                                                    variant="outline"
                                                    // size="sm"
                                                    className="cursor-pointer"
                                                    onClick={handleNextFunFact}
                                                >
                                                    Next Fun Fact
                                                </Button>

                                                {showNextButton && (
                                                    <>
                                                        <Button
                                                            className="gap-2 cursor-pointer"
                                                            onClick={handleNextDestination}
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                            Play Again
                                                        </Button>
                                                        <Button
                                                            className="gap-2 cursor-pointer"
                                                            onClick={() => router.push('/')}
                                                        >
                                                            <MoveLeftIcon className="h-4 w-4" />
                                                            Home
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </main>
        </div>
    );
}